import React from 'react';
import { Check, Star, Zap, Crown, ChevronDown } from 'lucide-react';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with resume optimization',
      icon: <Star className="w-6 h-6" />,
      features: [
        '1 resume analysis per month',
        'Basic ATS score',
        'Generic improvement suggestions',
        'PDF download',
        'Email support'
      ],
      limitations: [
        'Limited job matching',
        'No priority support',
        'Basic templates only'
      ],
      buttonText: 'Get Started Free',
      buttonStyle: 'border-2 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-gray-100',
      popular: false
    },
    {
      name: 'Pro',
      price: '$20',
      period: 'per month',
      description: 'Everything you need for serious job hunting',
      icon: <Zap className="w-6 h-6" />,
      features: [
        'Unlimited resume analyses',
        'Advanced ATS optimization',
        'AI-powered job matching',
        'Industry-specific suggestions',
        'Multiple resume templates',
        'Cover letter generator',
        'LinkedIn profile optimization',
        'Priority email support',
        'Export to multiple formats'
      ],
      limitations: [],
      buttonText: 'Start Pro Trial',
      buttonStyle: 'bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 hover:shadow-2xl hover:scale-105',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For teams and organizations at scale',
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Everything in Pro',
        'Team management dashboard',
        'Bulk resume processing',
        'Custom ATS training',
        'API access',
        'Advanced analytics',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantees'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      buttonStyle: 'border-2 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-gray-100',
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'How does the ATS scoring work?',
      answer: 'Our AI analyzes your resume against hundreds of ATS systems used by major companies, checking for keyword optimization, formatting compatibility, and structural elements that improve parsing accuracy.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access to Pro features until the end of your current billing period.'
    },
    {
      question: "What's included in the job matching?",
      answer: 'Our AI scans job boards like LinkedIn, Indeed, and Glassdoor to find positions that match your skills, experience, and career goals, then provides personalized application strategies.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 14-day money-back guarantee for all paid plans. If you\'re not satisfied with the results, contact our support team for a full refund.'
    },
    {
      question: 'How secure is my data?',
      answer: 'We use enterprise-grade encryption and never share your personal information. Your resume data is stored securely and can be deleted at any time upon request.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.'
    }
  ];

  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your career goals. Start free and upgrade as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-gray-800/30 border rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? 'border-gray-500 shadow-2xl shadow-gray-500/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100' 
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {plan.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-100 mb-2">
                  {plan.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-100">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-400 ml-2">
                      {plan.period}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-gray-100" />
                    </div>
                    <span className="text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
                
                {plan.limitations.map((limitation, limitationIndex) => (
                  <div key={limitationIndex} className="flex items-center space-x-3 opacity-60">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-500 line-through">
                      {limitation}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${plan.buttonStyle}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-100 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-100">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-4 bg-gray-900/50">
                    <p className="text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 py-16">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have boosted their ATS scores and landed their dream jobs.
          </p>
          
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <Zap className="w-5 h-5 mr-2" />
            Start Your Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;