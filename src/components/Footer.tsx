import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Resume Analyzer', href: '/resume' },
      { name: 'Project Showcase', href: '/projects' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Q&A Community', href: '/qa' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' }
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Help Center', href: '/help' },
      { name: 'API Documentation', href: '/docs' },
      { name: 'Status', href: '/status' }
    ]
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@resumify.com' }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-gray-600 to-gray-500">
                <FileText className="w-6 h-6 text-gray-100" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
                Resumify
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Transform your career with AI-powered resume optimization and job matching. 
              Get ATS-friendly resumes that land interviews at top companies.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-300 transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} Resumify. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 text-sm transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 text-sm transition-colors">
              Terms
            </Link>
            <Link to="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;