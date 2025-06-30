import React, { useState, useRef } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, Target, Sparkles, BarChart3, Users, FileText, Zap, TrendingUp, Eye, Clock, Search, MapPin, FileSpreadsheet, Loader2 } from 'lucide-react';
import { analyzeResumeText, extractTextFromFile, ATSAnalysisResult } from '../utils/resumeAnalyzer';

const ResumePage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisType, setAnalysisType] = useState<'quick' | 'detailed' | 'optimization'>('detailed');
  const [showKeywordDetails, setShowKeywordDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingJobSheet, setIsGeneratingJobSheet] = useState(false);
  const [jobSheetStatus, setJobSheetStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>('idle');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [jobSearchProgress, setJobSearchProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
      analyzeResume(file);
    }
  };

  const analyzeResume = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Extract text from file
      const resumeText = await extractTextFromFile(file);
      
      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error('Unable to extract sufficient text from the file. Please ensure the file is not corrupted and contains readable text.');
      }
      
      // Simulate processing time for better UX
      setTimeout(() => {
        const result = analyzeResumeText(resumeText, jobDescription);
        setAnalysisResult(result);
        setIsAnalyzing(false);
      }, 2500);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while analyzing your resume. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const generateJobSheet = async () => {
    if (!analysisResult) return;

    setIsGeneratingJobSheet(true);
    setJobSheetStatus('generating');
    setJobSearchProgress('Initializing job search...');

    try {
      // Generate a unique user ID for this session
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Extract suggested roles from analysis result
      const suggestedRoles = analysisResult.jobMatches.map(job => job.title);
      
      // Trigger n8n workflow
      setJobSearchProgress('Triggering LinkedIn job search workflow...');
      
      const workflowResponse = await fetch('/api/trigger-job-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          resume_text: analysisResult.extractedText,
          suggested_roles: suggestedRoles,
          keywords: analysisResult.sections.keywords.found
        })
      });

      if (!workflowResponse.ok) {
        throw new Error('Failed to trigger job search workflow');
      }

      const workflowResult = await workflowResponse.json();
      
      // Simulate progress updates
      const progressSteps = [
        'Searching LinkedIn RSS feeds...',
        'Processing job listings...',
        'Generating cover letters...',
        'Creating Excel spreadsheet...',
        'Finalizing download...'
      ];

      for (let i = 0; i < progressSteps.length; i++) {
        setJobSearchProgress(progressSteps[i]);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Set the download URL from the workflow result
      setDownloadUrl(workflowResult.download_url);
      setJobSheetStatus('ready');
      setJobSearchProgress('Job search completed successfully!');
      
    } catch (error) {
      console.error('Error generating job sheet:', error);
      setJobSheetStatus('error');
      setJobSearchProgress('Failed to generate job sheet. Please try again.');
    } finally {
      setIsGeneratingJobSheet(false);
    }
  };

  const downloadJobSheet = () => {
    if (downloadUrl) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'linkedin-job-matches.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setError(null);
      analyzeResume(files[0]);
    }
  };

  const getImprovementIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-400';
    if (score >= 60) return 'from-yellow-500 to-yellow-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Advanced ATS Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Upload your resume for comprehensive ATS analysis with deep keyword extraction, formatting review, and personalized optimization recommendations.
          </p>
        </div>

        {!uploadedFile ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            {/* Analysis Type Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Choose Analysis Type
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setAnalysisType('quick')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    analysisType === 'quick'
                      ? 'border-gray-500 bg-gray-100 dark:bg-gray-800'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <Zap className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Quick Scan</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Basic ATS compatibility check</p>
                </button>
                
                <button
                  onClick={() => setAnalysisType('detailed')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    analysisType === 'detailed'
                      ? 'border-gray-500 bg-gray-100 dark:bg-gray-800'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <Eye className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Detailed Analysis</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive keyword & structure review</p>
                </button>
                
                <button
                  onClick={() => setAnalysisType('optimization')}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    analysisType === 'optimization'
                      ? 'border-gray-500 bg-gray-100 dark:bg-gray-800'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <Target className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">ATS Optimization</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Job-specific keyword tuning</p>
                </button>
              </div>
            </div>

            {/* Job Description Input */}
            {analysisType === 'optimization' && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description (Optional but Recommended)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for targeted keyword optimization and better job matching..."
                  className="w-full h-32 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                />
              </div>
            )}

            {/* Upload Area */}
            <div
              className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-300 cursor-pointer group bg-white/50 dark:bg-gray-800/20"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-gray-100" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Upload Your Resume
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Drag and drop your resume here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Supports PDF, DOC, DOCX files up to 10MB
                  </p>
                </div>
                
                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 dark:text-red-300 font-medium">Error</p>
                </div>
                <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
              </div>
            )}
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-8">
            {/* File Info */}
            <div className="bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {uploadedFile.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis
                      {analysisResult && ` • ${analysisResult.wordCount} words`}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setAnalysisResult(null);
                    setError(null);
                    setJobSheetStatus('idle');
                    setDownloadUrl(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Upload Different File
                </button>
              </div>
            </div>

            {isAnalyzing ? (
              /* Loading State */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center mx-auto animate-pulse mb-6">
                  <Sparkles className="w-8 h-8 text-gray-100" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Analyzing Your Resume...
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Our advanced AI is performing deep keyword extraction and ATS compatibility analysis
                </p>
                <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto">
                  <div className="h-2 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full animate-pulse w-3/4"></div>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Extracting text and keywords...</span>
                  </div>
                </div>
              </div>
            ) : analysisResult && (
              /* Results */
              <div className="space-y-8">
                {/* Overall Score */}
                <div className="bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#scoreGradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - analysisResult.overallScore / 100)}`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={analysisResult.overallScore >= 80 ? '#10B981' : analysisResult.overallScore >= 60 ? '#F59E0B' : '#EF4444'} />
                            <stop offset="100%" stopColor={analysisResult.overallScore >= 80 ? '#059669' : analysisResult.overallScore >= 60 ? '#D97706' : '#DC2626'} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className={`text-4xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                            {analysisResult.overallScore}
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">ATS Score</p>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {analysisResult.overallScore >= 80 ? 'Excellent ATS Compatibility!' : 
                       analysisResult.overallScore >= 60 ? 'Good Foundation, Room for Improvement' : 'Significant Optimization Needed'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {analysisResult.overallScore >= 80 ? 'Your resume is well-optimized for ATS systems and should pass most automated screenings.' :
                       analysisResult.overallScore >= 60 ? 'Your resume has good potential but needs some optimization to improve ATS compatibility.' :
                       'Your resume requires significant improvements to pass ATS systems effectively.'}
                    </p>
                  </div>
                </div>

                {/* Section Scores */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Keywords</h4>
                      <span className={`text-2xl font-bold ${getScoreColor(analysisResult.sections.keywords.score)}`}>
                        {Math.round(analysisResult.sections.keywords.score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(analysisResult.sections.keywords.score)}`}
                        style={{ width: `${analysisResult.sections.keywords.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {analysisResult.sections.keywords.found.length} keywords found
                    </p>
                  </div>

                  <div className="bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Structure</h4>
                      <span className={`text-2xl font-bold ${getScoreColor(analysisResult.sections.structure.score)}`}>
                        {Math.round(analysisResult.sections.structure.score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(analysisResult.sections.structure.score)}`}
                        style={{ width: `${analysisResult.sections.structure.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {analysisResult.sections.structure.sections.length} sections detected
                    </p>
                  </div>

                  <div className="bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Formatting</h4>
                      <span className={`text-2xl font-bold ${getScoreColor(analysisResult.sections.formatting.score)}`}>
                        {Math.round(analysisResult.sections.formatting.score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(analysisResult.sections.formatting.score)}`}
                        style={{ width: `${analysisResult.sections.formatting.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      ATS-friendly format
                    </p>
                  </div>

                  <div className="bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Readability</h4>
                      <span className={`text-2xl font-bold ${getScoreColor(analysisResult.sections.readability.score)}`}>
                        {Math.round(analysisResult.sections.readability.score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(analysisResult.sections.readability.score)}`}
                        style={{ width: `${analysisResult.sections.readability.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Clear and concise
                    </p>
                  </div>
                </div>

                {/* LinkedIn Job Search Section */}
                <div className="bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                    <Search className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-400" />
                    LinkedIn Job Search & Excel Export
                  </h3>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileSpreadsheet className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Automated LinkedIn Job Matching
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Our AI will search LinkedIn RSS feeds for jobs matching your suggested roles, 
                          process up to 5 jobs per role, generate personalized cover letters, and create 
                          a comprehensive Excel spreadsheet for download.
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">LinkedIn RSS feed search</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Automated cover letter generation</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Excel spreadsheet export</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Role-based job matching</span>
                          </div>
                        </div>

                        <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Suggested Roles for Search:</h5>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.jobMatches.map((job, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-700">
                                {job.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Search Status */}
                  {jobSheetStatus !== 'idle' && (
                    <div className="mb-6">
                      {jobSheetStatus === 'generating' && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-900 dark:text-blue-100">Generating Job Search Results</h4>
                              <p className="text-blue-700 dark:text-blue-300 text-sm">{jobSearchProgress}</p>
                            </div>
                          </div>
                          <div className="mt-3 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                            <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full animate-pulse w-3/4"></div>
                          </div>
                        </div>
                      )}

                      {jobSheetStatus === 'ready' && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <div>
                                <h4 className="font-medium text-green-900 dark:text-green-100">Job Search Complete!</h4>
                                <p className="text-green-700 dark:text-green-300 text-sm">Your Excel file is ready for download</p>
                              </div>
                            </div>
                            <button
                              onClick={downloadJobSheet}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Excel
                            </button>
                          </div>
                        </div>
                      )}

                      {jobSheetStatus === 'error' && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <div>
                              <h4 className="font-medium text-red-900 dark:text-red-100">Job Search Failed</h4>
                              <p className="text-red-700 dark:text-red-300 text-sm">{jobSearchProgress}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Generate Button */}
                  {jobSheetStatus === 'idle' && (
                    <div className="text-center">
                      <button
                        onClick={generateJobSheet}
                        disabled={isGeneratingJobSheet}
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingJobSheet ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating Job Search...
                          </>
                        ) : (
                          <>
                            <Search className="w-5 h-5 mr-2" />
                            Generate LinkedIn Job Search
                          </>
                        )}
                      </button>
                      <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                        This process may take 2-3 minutes to complete
                      </p>
                    </div>
                  )}
                </div>

                {/* Improvements */}
                <div className="bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-400" />
                    Priority Improvement Recommendations
                  </h3>
                  
                  <div className="space-y-4">
                    {analysisResult.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
                        {getImprovementIcon(improvement.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {improvement.title}
                            </h4>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                              {improvement.impact}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {improvement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keywords Analysis */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                        Found Keywords ({analysisResult.sections.keywords.found.length})
                      </h3>
                      <button
                        onClick={() => setShowKeywordDetails(!showKeywordDetails)}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center"
                      >
                        <Search className="w-4 h-4 mr-1" />
                        {showKeywordDetails ? 'Hide' : 'Show'} Details
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {analysisResult.sections.keywords.found.slice(0, showKeywordDetails ? undefined : 15).map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full border border-green-200 dark:border-green-700">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    {!showKeywordDetails && analysisResult.sections.keywords.found.length > 15 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        +{analysisResult.sections.keywords.found.length - 15} more keywords
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Keyword density: {analysisResult.sections.keywords.density}%
                    </p>
                  </div>

                  <div className="bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                      Missing High-Impact Keywords ({analysisResult.sections.keywords.missing.length})
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {analysisResult.sections.keywords.missing.slice(0, 12).map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded-full border border-red-200 dark:border-red-700">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    {analysisResult.sections.keywords.missing.length > 12 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        +{analysisResult.sections.keywords.missing.length - 12} more missing keywords
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Consider adding these relevant industry keywords to improve ATS compatibility
                    </p>
                  </div>
                </div>

                {/* Job Matches */}
                <div className="bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-400" />
                    AI-Matched Job Opportunities
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {analysisResult.jobMatches.map((job, index) => (
                      <div key={index} className="p-6 bg-gray-50 dark:bg-gray-900/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                            {job.title}
                          </h4>
                          <span className={`text-lg font-bold ${getScoreColor(job.match)} bg-white dark:bg-gray-800 px-3 py-1 rounded-full border`}>
                            {job.match}%
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-gray-700 dark:text-gray-300 font-medium flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {job.company}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {job.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Matching Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {job.requirements.slice(0, 4).map((req, reqIndex) => (
                              <span key={reqIndex} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded border border-blue-200 dark:border-blue-700">
                                {req}
                              </span>
                            ))}
                            {job.requirements.length > 4 && (
                              <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                                +{job.requirements.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Download Section */}
                <div className="text-center">
                  <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-500 text-gray-100 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <Download className="w-5 h-5 mr-2" />
                    Download Detailed Analysis Report
                  </button>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Get a comprehensive PDF report with all findings, recommendations, and optimization strategies
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePage;