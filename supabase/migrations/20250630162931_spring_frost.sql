/*
  # Usage Tracking and Analytics Schema

  1. New Tables
    - usage_logs
      - id (uuid, primary key)
      - user_id (uuid, references user_profiles)
      - action_type (text)
      - resource_id (uuid)
      - metadata (jsonb)
      - created_at (timestamp)
    
    - api_keys
      - id (uuid, primary key)
      - user_id (uuid, references user_profiles)
      - key_name (text)
      - key_hash (text)
      - permissions (text array)
      - last_used_at (timestamp)
      - is_active (boolean)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
    - Add usage tracking functions

  3. Functions
    - Usage tracking functions
    - Rate limiting functions
    - Analytics functions
*/

CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('resume_analysis', 'job_search', 'download', 'api_call')),
  resource_id uuid,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  key_name text NOT NULL,
  key_hash text NOT NULL UNIQUE,
  key_prefix text NOT NULL,
  permissions text[] DEFAULT '{"read"}',
  last_used_at timestamptz,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policies for usage_logs
CREATE POLICY "Users can read own usage logs"
  ON usage_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own usage logs"
  ON usage_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for api_keys
CREATE POLICY "Users can read own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own API keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own API keys"
  ON api_keys
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own API keys"
  ON api_keys
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action_type ON usage_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- Function to log usage
CREATE OR REPLACE FUNCTION public.log_usage(
  p_user_id uuid,
  p_action_type text,
  p_resource_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO usage_logs (user_id, action_type, resource_id, metadata)
  VALUES (p_user_id, p_action_type, p_resource_id, p_metadata)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check usage limits
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  p_user_id uuid,
  p_action_type text
)
RETURNS boolean AS $$
DECLARE
  user_plan text;
  plan_limit integer;
  current_usage integer;
  current_month_start date;
BEGIN
  -- Get user's current plan
  SELECT us.plan_id INTO user_plan
  FROM user_subscriptions us
  WHERE us.user_id = p_user_id 
    AND us.status = 'active'
    AND us.current_period_end > now()
  ORDER BY us.created_at DESC
  LIMIT 1;
  
  -- Default to free plan if no active subscription
  IF user_plan IS NULL THEN
    user_plan := 'free';
  END IF;
  
  -- Get plan limits
  IF p_action_type = 'resume_analysis' THEN
    SELECT analyses_per_month INTO plan_limit
    FROM subscription_plans
    WHERE id = user_plan;
  ELSIF p_action_type = 'job_search' THEN
    SELECT job_searches_per_month INTO plan_limit
    FROM subscription_plans
    WHERE id = user_plan;
  ELSE
    RETURN true; -- No limit for other actions
  END IF;
  
  -- Unlimited usage for -1 limit
  IF plan_limit = -1 THEN
    RETURN true;
  END IF;
  
  -- Calculate current month usage
  current_month_start := DATE_TRUNC('month', CURRENT_DATE);
  
  SELECT COUNT(*) INTO current_usage
  FROM usage_logs
  WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND created_at >= current_month_start;
  
  RETURN current_usage < plan_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user analytics
CREATE OR REPLACE FUNCTION public.get_user_analytics(p_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  current_month_start date;
  last_month_start date;
  last_month_end date;
BEGIN
  current_month_start := DATE_TRUNC('month', CURRENT_DATE);
  last_month_start := DATE_TRUNC('month', CURRENT_DATE - interval '1 month');
  last_month_end := current_month_start - interval '1 day';
  
  WITH monthly_stats AS (
    SELECT 
      COUNT(*) FILTER (WHERE action_type = 'resume_analysis' AND created_at >= current_month_start) as analyses_this_month,
      COUNT(*) FILTER (WHERE action_type = 'job_search' AND created_at >= current_month_start) as searches_this_month,
      COUNT(*) FILTER (WHERE action_type = 'resume_analysis' AND created_at >= last_month_start AND created_at <= last_month_end) as analyses_last_month,
      COUNT(*) FILTER (WHERE action_type = 'job_search' AND created_at >= last_month_start AND created_at <= last_month_end) as searches_last_month,
      COUNT(*) FILTER (WHERE action_type = 'resume_analysis') as total_analyses,
      COUNT(*) FILTER (WHERE action_type = 'job_search') as total_searches
    FROM usage_logs
    WHERE user_id = p_user_id
  )
  SELECT jsonb_build_object(
    'current_month', jsonb_build_object(
      'analyses', analyses_this_month,
      'job_searches', searches_this_month
    ),
    'last_month', jsonb_build_object(
      'analyses', analyses_last_month,
      'job_searches', searches_last_month
    ),
    'total', jsonb_build_object(
      'analyses', total_analyses,
      'job_searches', total_searches
    )
  ) INTO result
  FROM monthly_stats;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;