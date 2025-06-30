import React from 'react';
import { ExternalLink, Github, Code, Sparkles, TrendingUp, Zap } from 'lucide-react';

const ProjectsPage: React.FC = () => {
  const trendingProjects = [
    {
      title: 'AI-Powered Code Assistant',
      description: 'Advanced code completion and generation tool using GPT-4 and custom ML models. Features real-time suggestions, bug detection, and automated refactoring.',
      image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Python', 'OpenAI API', 'FastAPI', 'React', 'Docker'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      trending: true,
      category: 'AI/ML'
    },
    {
      title: 'DeFi Yield Farming Platform',
      description: 'Decentralized finance platform for automated yield farming with smart contract integration, portfolio tracking, and risk assessment.',
      image: 'https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Solidity', 'Web3.js', 'React', 'Hardhat', 'IPFS'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      trending: true,
      category: 'Web3'
    },
    {
      title: 'Cross-Platform Fitness App',
      description: 'React Native fitness tracking app with AI workout recommendations, social features, and wearable device integration.',
      image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['React Native', 'Firebase', 'TensorFlow', 'HealthKit'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      trending: true,
      category: 'Mobile'
    }
  ];

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React, Node.js, and PostgreSQL. Features include real-time inventory, payment processing, and admin dashboard.',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true
    },
    {
      title: 'AI Chat Application',
      description: 'Real-time chat application with AI-powered responses using OpenAI API. Built with React, Socket.io, and Express.',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['React', 'Socket.io', 'OpenAI', 'Express', 'MongoDB'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true
    },
    {
      title: 'Task Management Dashboard',
      description: 'Comprehensive project management tool with drag-and-drop functionality, team collaboration, and analytics.',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Vue.js', 'Firebase', 'Chart.js', 'Tailwind CSS'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    },
    {
      title: 'Weather Analytics App',
      description: 'Weather forecasting application with interactive maps, historical data analysis, and personalized alerts.',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['React Native', 'Weather API', 'Redux', 'Maps SDK'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    },
    {
      title: 'Cryptocurrency Tracker',
      description: 'Real-time cryptocurrency portfolio tracker with price alerts, market analysis, and trading insights.',
      image: 'https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Next.js', 'CoinGecko API', 'TypeScript', 'Chart.js'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    },
    {
      title: 'Social Media Analytics',
      description: 'Comprehensive social media analytics platform with engagement tracking, sentiment analysis, and automated reporting.',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Angular', 'D3.js', 'Python', 'Django', 'Redis'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    },
    {
      title: 'Machine Learning Pipeline',
      description: 'End-to-end ML pipeline for predictive analytics with automated model training, deployment, and monitoring.',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Python', 'TensorFlow', 'Kubernetes', 'MLflow', 'Apache Airflow'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    },
    {
      title: 'NFT Marketplace',
      description: 'Decentralized NFT marketplace with minting, trading, and auction features built on Ethereum blockchain.',
      image: 'https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['Solidity', 'React', 'Web3.js', 'IPFS', 'Metamask'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    },
    {
      title: 'IoT Dashboard',
      description: 'Real-time IoT device monitoring dashboard with data visualization, alerts, and remote control capabilities.',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      tech: ['React', 'Node.js', 'MQTT', 'InfluxDB', 'Grafana'],
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: false
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Project Showcase
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore real-world examples of resumes that achieved high ATS scores and landed interviews at top companies.
          </p>
        </div>

        {/* Trending Now Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-100 mb-8 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-gray-400" />
            Trending Now
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {trendingProjects.map((project, index) => (
              <div key={index} className="group bg-gray-800/30 border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300 hover:scale-[1.02]">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 filter grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 text-sm font-medium rounded-full flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full">
                      Trending
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full border border-gray-600">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <a
                      href={project.demo}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                    <a
                      href={project.github}
                      className="flex items-center px-4 py-2 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-600 hover:text-gray-100 transition-all duration-300"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-100 mb-8 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-gray-400" />
            Featured Success Stories
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {projects.filter(p => p.featured).map((project, index) => (
              <div key={index} className="group bg-gray-800/30 border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300 hover:scale-[1.02]">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 filter grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 text-sm font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full border border-gray-600">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <a
                      href={project.demo}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                    <a
                      href={project.github}
                      className="flex items-center px-4 py-2 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-600 hover:text-gray-100 transition-all duration-300"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Projects */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-100 mb-8 flex items-center">
            <Code className="w-6 h-6 mr-2 text-gray-400" />
            All Projects
          </h2>
          
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="group bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500 filter grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
                  {project.featured && (
                    <div className="absolute top-2 right-2">
                      <Sparkles className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-100 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tech.slice(0, 3).map((tech, techIndex) => (
                      <span key={techIndex} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <a
                      href={project.demo}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 text-sm rounded font-medium hover:shadow-lg transition-all duration-300"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Demo
                    </a>
                    <a
                      href={project.github}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-600 text-gray-300 text-sm rounded font-medium hover:bg-gray-600 hover:text-gray-100 transition-all duration-300"
                    >
                      <Github className="w-3 h-3 mr-1" />
                      Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;