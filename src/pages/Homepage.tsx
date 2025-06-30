import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Target, Sparkles, Code, Upload } from 'lucide-react';

const Homepage: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return;

    const commands = [
      '$ npm install my-skills',
      '✓ Installing React expertise...',
      '✓ Installing TypeScript mastery...',
      '✓ Installing AI integration...',
      '✓ Installing job-matching algorithms...',
      '$ resumify --optimize --ats-score',
      '🚀 Resume optimized for ATS systems',
      '📊 Score improved by 87%',
      '💼 Matched with 23 job opportunities',
    ];

    let commandIndex = 0;
    let charIndex = 0;
    let currentLine = '';

    const typeCommand = () => {
      if (commandIndex >= commands.length) {
        setTimeout(() => {
          terminal.innerHTML = '';
          commandIndex = 0;
          charIndex = 0;
          typeCommand();
        }, 3000);
        return;
      }

      const command = commands[commandIndex];
      
      if (charIndex < command.length) {
        currentLine = command.slice(0, charIndex + 1);
        terminal.innerHTML = terminal.innerHTML.split('\n').slice(0, -1).join('\n') + 
          (terminal.innerHTML.includes('\n') ? '\n' : '') + 
          `<span class="text-gray-700 dark:text-gray-300">${currentLine}</span>`;
        charIndex++;
        setTimeout(typeCommand, 50);
      } else {
        terminal.innerHTML += '\n';
        commandIndex++;
        charIndex = 0;
        setTimeout(typeCommand, 800);
      }
    };

    const timeout = setTimeout(typeCommand, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-300 dark:to-gray-200 bg-clip-text text-transparent">
                  Resumify
                </span>
                <br />
                <span className="text-gray-900 dark:text-gray-100">
                  Your Career,
                </span>
                <br />
                <span className="text-gray-700 dark:text-gray-300">
                  Amplified
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                Transform your resume into an ATS-optimized powerhouse. Get matched with perfect job opportunities using AI-powered career intelligence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/resume"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Upload className="w-5 h-5 mr-2" />
                Analyze My Resume
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/projects"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                View Examples
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ATS Optimized
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  87% Success Rate
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  AI Powered
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Terminal */}
          <div className="relative">
            <div className="bg-white/50 dark:bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-4 font-mono">resumify-terminal</span>
              </div>
              
              <div 
                ref={terminalRef}
                className="font-mono text-sm h-64 overflow-hidden whitespace-pre-wrap text-gray-700 dark:text-gray-300"
              >
                <span className="text-gray-700 dark:text-gray-300">$</span>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-400 rounded-full opacity-20 blur-xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white/30 dark:bg-gray-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Choose Resumify?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our AI-powered platform doesn't just improve your resume—it transforms your entire job search strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-gray-100" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                ATS Score Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Get detailed insights on how well your resume performs against Applicant Tracking Systems with specific improvement recommendations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-gray-100" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                AI Job Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our intelligent algorithms scan LinkedIn, Indeed, and other job boards to find opportunities that perfectly match your profile.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 hover:bg-white/70 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-gray-100" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Resume as Code
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Version control your career progression with our unique "resume-as-code" approach for systematic skill development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already boosted their ATS scores and landed their dream jobs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/resume"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link
              to="/pricing"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;