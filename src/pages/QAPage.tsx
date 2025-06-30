import React, { useState } from 'react';
import { Search, ThumbsUp, ThumbsDown, MessageSquare, Plus, Filter, TrendingUp } from 'lucide-react';

const QAPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions', count: 127 },
    { id: 'ats', name: 'ATS Optimization', count: 34 },
    { id: 'keywords', name: 'Keywords', count: 28 },
    { id: 'formatting', name: 'Formatting', count: 22 },
    { id: 'experience', name: 'Experience', count: 19 },
    { id: 'skills', name: 'Skills', count: 15 },
    { id: 'cover-letter', name: 'Cover Letters', count: 9 }
  ];

  const questions = [
    {
      id: 1,
      title: 'How do I optimize my resume for ATS systems?',
      content: 'I keep getting rejected by automated systems. What are the key things I should focus on to make my resume ATS-friendly?',
      author: 'Sarah M.',
      category: 'ats',
      votes: 45,
      answers: 8,
      views: 1234,
      tags: ['ATS', 'Optimization', 'Keywords'],
      timeAgo: '2 hours ago',
      trending: true
    },
    {
      id: 2,
      title: 'Should I include a photo on my resume?',
      content: 'I\'ve heard conflicting advice about whether to include a professional photo on my resume. What\'s the current best practice?',
      author: 'Mike J.',
      category: 'formatting',
      votes: 32,
      answers: 12,
      views: 892,
      tags: ['Photo', 'Formatting', 'Best Practices'],
      timeAgo: '5 hours ago',
      trending: false
    },
    {
      id: 3,
      title: 'How many keywords should I include in my resume?',
      content: 'I want to include relevant keywords for my industry, but I don\'t want to overstuff. What\'s the right balance?',
      author: 'Emily R.',
      category: 'keywords',
      votes: 28,
      answers: 6,
      views: 567,
      tags: ['Keywords', 'SEO', 'Balance'],
      timeAgo: '1 day ago',
      trending: true
    },
    {
      id: 4,
      title: 'What font size and type should I use?',
      content: 'Are there specific fonts that work better with ATS systems? And what about font size for readability?',
      author: 'David K.',
      category: 'formatting',
      votes: 21,
      answers: 9,
      views: 445,
      tags: ['Fonts', 'Typography', 'ATS'],
      timeAgo: '2 days ago',
      trending: false
    },
    {
      id: 5,
      title: 'How do I explain employment gaps?',
      content: 'I have a 6-month gap in my employment history. What\'s the best way to address this on my resume?',
      author: 'Lisa P.',
      category: 'experience',
      votes: 38,
      answers: 15,
      views: 1120,
      tags: ['Employment Gap', 'Experience', 'Strategy'],
      timeAgo: '3 days ago',
      trending: true
    },
    {
      id: 6,
      title: 'Is it worth paying for resume writing services?',
      content: 'I\'m considering hiring a professional resume writer. Are they worth the investment, or can I do it myself?',
      author: 'Tom W.',
      category: 'all',
      votes: 15,
      answers: 7,
      views: 332,
      tags: ['Professional Services', 'Investment', 'DIY'],
      timeAgo: '1 week ago',
      trending: false
    }
  ];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Community Q&A
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get answers from resume experts and fellow job seekers. Share your knowledge and help others succeed.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Ask Question Button */}
            <button className="w-full mb-6 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
              <Plus className="w-5 h-5 mr-2" />
              Ask Question
            </button>

            {/* Categories */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-gray-700 text-gray-100 border border-gray-600'
                        : 'text-gray-300 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm opacity-70">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-gray-400" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {['ATS Optimization', 'Remote Work Resumes', 'AI Resume Tools', 'Career Gaps', 'Industry Keywords'].map((topic, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-gray-500 to-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions, answers, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/30 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {filteredQuestions.map((question) => (
                <div key={question.id} className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-100 hover:text-gray-300 transition-colors">
                          {question.title}
                        </h3>
                        {question.trending && (
                          <span className="px-2 py-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-medium rounded-full flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-3 line-clamp-2">
                        {question.content}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {question.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{question.votes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{question.answers} answers</span>
                      </div>
                      <span>{question.views} views</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>by {question.author}</span>
                      <span>{question.timeAgo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="px-8 py-3 border-2 border-gray-600 text-gray-300 rounded-xl font-medium hover:bg-gray-600 hover:text-gray-100 transition-all duration-300">
                Load More Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAPage;