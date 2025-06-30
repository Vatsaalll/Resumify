import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up PDF.js worker - use Vite's ?url import for proper asset handling
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Resume Analysis Utilities
export interface ATSAnalysisResult {
  overallScore: number;
  sections: {
    formatting: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
    keywords: {
      score: number;
      found: string[];
      missing: string[];
      density: number;
      locations: { [key: string]: string[] };
    };
    structure: {
      score: number;
      sections: string[];
      missingCritical: string[];
    };
    readability: {
      score: number;
      issues: string[];
    };
  };
  improvements: Array<{
    type: 'critical' | 'warning' | 'suggestion';
    title: string;
    description: string;
    impact: string;
  }>;
  jobMatches: Array<{
    title: string;
    match: number;
    company: string;
    location: string;
    requirements: string[];
  }>;
  extractedText: string;
  wordCount: number;
}

// Comprehensive ATS keywords by industry with variations
const industryKeywords = {
  technology: [
    // Programming Languages
    'JavaScript', 'JS', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'TS', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'HTML', 'CSS', 'HTML5', 'CSS3', 'SCSS', 'SASS', 'Less',
    
    // Frameworks & Libraries
    'React', 'ReactJS', 'React.js', 'Angular', 'AngularJS', 'Vue', 'Vue.js', 'VueJS',
    'Node.js', 'NodeJS', 'Express', 'Express.js', 'Django', 'Flask', 'Spring', 'Laravel',
    'jQuery', 'Bootstrap', 'Tailwind', 'TailwindCSS', 'Material-UI', 'Ant Design',
    
    // Databases
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'NoSQL',
    'Database', 'DBMS', 'Mongoose', 'Sequelize', 'Prisma',
    
    // Cloud & DevOps
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD',
    'DevOps', 'Terraform', 'Ansible', 'Nginx', 'Apache', 'Linux', 'Ubuntu',
    
    // Tools & Technologies
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Jira', 'Confluence',
    'VS Code', 'Visual Studio', 'IntelliJ', 'Eclipse', 'PyCharm', 'Sublime Text',
    'Webpack', 'Vite', 'Parcel', 'Gulp', 'Grunt', 'NPM', 'Yarn', 'Pip',
    
    // Methodologies
    'Agile', 'Scrum', 'Kanban', 'Waterfall', 'TDD', 'BDD', 'Unit Testing',
    'Integration Testing', 'API Testing', 'Jest', 'Mocha', 'Cypress',
    
    // Concepts
    'REST API', 'RESTful', 'GraphQL', 'Microservices', 'Serverless',
    'Machine Learning', 'ML', 'AI', 'Artificial Intelligence', 'Data Science',
    'Big Data', 'Analytics', 'ETL', 'Data Pipeline', 'Data Warehouse',
    'OOP', 'Object-Oriented Programming', 'Functional Programming',
    'Data Structures', 'Algorithms', 'DSA', 'System Design'
  ],
  marketing: [
    'SEO', 'SEM', 'Google Analytics', 'Google Ads', 'Facebook Ads', 'Social Media',
    'Content Marketing', 'Email Marketing', 'PPC', 'Pay-Per-Click', 'CPC', 'CPM',
    'Brand Management', 'Campaign Management', 'Lead Generation', 'Conversion Optimization',
    'A/B Testing', 'Marketing Automation', 'CRM', 'Salesforce', 'HubSpot',
    'Digital Marketing', 'Inbound Marketing', 'Outbound Marketing', 'Growth Hacking'
  ],
  finance: [
    'Financial Analysis', 'Excel', 'Financial Modeling', 'Risk Management',
    'Investment', 'Portfolio Management', 'Accounting', 'GAAP', 'IFRS',
    'Budgeting', 'Forecasting', 'Compliance', 'Audit', 'Tax', 'Valuation',
    'Bloomberg', 'Reuters', 'QuickBooks', 'SAP', 'Oracle Financials'
  ],
  healthcare: [
    'Patient Care', 'Medical Records', 'HIPAA', 'Clinical', 'Healthcare',
    'Medical', 'Nursing', 'Treatment', 'Diagnosis', 'EHR', 'EMR',
    'Electronic Health Records', 'Quality Assurance', 'Regulatory Compliance',
    'FDA', 'Clinical Trials', 'Medical Devices', 'Pharmaceuticals'
  ]
};

// Enhanced keyword extraction with context
const extractKeywordsWithContext = (text: string): { [key: string]: string[] } => {
  const keywordLocations: { [key: string]: string[] } = {};
  const lines = text.split('\n');
  
  // Get all possible keywords from all industries
  const allKeywords = Object.values(industryKeywords).flat();
  
  allKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    lines.forEach((line, index) => {
      if (regex.test(line)) {
        if (!keywordLocations[keyword]) {
          keywordLocations[keyword] = [];
        }
        keywordLocations[keyword].push(`Line ${index + 1}: ${line.trim()}`);
      }
    });
  });
  
  return keywordLocations;
};

// Critical resume sections with variations
const criticalSections = [
  'Contact Information', 'Professional Summary', 'Work Experience',
  'Education', 'Skills', 'Technical Skills'
];

const sectionPatterns = [
  /contact|phone|email|address|linkedin/i,
  /summary|objective|profile|about/i,
  /experience|employment|work|career|professional/i,
  /education|degree|university|college|academic/i,
  /skills|technical|competencies|technologies|tools/i,
  /projects|portfolio|work samples/i,
  /certifications|licenses|credentials/i,
  /achievements|awards|accomplishments/i
];

export const extractTextFromFile = async (file: File): Promise<string> => {
  try {
    if (file.type === 'application/pdf') {
      return await extractTextFromPDF(file);
    } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      return await extractTextFromWord(file);
    } else {
      // For plain text files
      return await extractTextFromPlainText(file);
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to extract text from file. Please try a different format.');
  }
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
};

const extractTextFromWord = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const extractTextFromPlainText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};

export const analyzeResumeText = (text: string, jobDescription?: string): ATSAnalysisResult => {
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const totalWords = words.length;
  
  // Extract keywords with their locations
  const keywordLocations = extractKeywordsWithContext(text);
  const foundKeywords = Object.keys(keywordLocations);
  
  // Detect industry based on keyword frequency
  let detectedIndustry = 'technology'; // default
  let maxMatches = 0;
  
  Object.entries(industryKeywords).forEach(([industry, keywords]) => {
    const matches = keywords.filter(keyword => 
      foundKeywords.some(found => 
        found.toLowerCase() === keyword.toLowerCase()
      )
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedIndustry = industry;
    }
  });

  // Get relevant keywords for detected industry
  const relevantKeywords = industryKeywords[detectedIndustry as keyof typeof industryKeywords];
  
  // Find missing keywords
  const missingKeywords = relevantKeywords.filter(keyword =>
    !foundKeywords.some(found => 
      found.toLowerCase() === keyword.toLowerCase()
    )
  );
  
  const keywordDensity = (foundKeywords.length / totalWords) * 100;
  
  // Analyze structure with better section detection
  const detectedSections: string[] = [];
  const textLower = text.toLowerCase();
  
  sectionPatterns.forEach((pattern, index) => {
    if (pattern.test(textLower)) {
      const sectionName = criticalSections[index] || `Section ${index + 1}`;
      if (!detectedSections.includes(sectionName)) {
        detectedSections.push(sectionName);
      }
    }
  });
  
  // Check for specific technical skills section
  if (/technical\s+skills|technologies|programming|languages/i.test(textLower)) {
    if (!detectedSections.includes('Technical Skills')) {
      detectedSections.push('Technical Skills');
    }
  }
  
  const missingCriticalSections = criticalSections.filter(section =>
    !detectedSections.some(found => 
      found.toLowerCase().includes(section.toLowerCase()) ||
      section.toLowerCase().includes(found.toLowerCase())
    )
  );

  // Enhanced scoring algorithm
  const keywordScore = Math.min((foundKeywords.length / Math.max(relevantKeywords.length * 0.3, 10)) * 100, 100);
  const structureScore = Math.min((detectedSections.length / criticalSections.length) * 100, 100);
  
  // Check for ATS-unfriendly formatting
  let formattingScore = 90;
  const formattingIssues: string[] = [];
  
  if (text.includes('\t') || /\s{4,}/.test(text)) {
    formattingScore -= 10;
    formattingIssues.push('Excessive spacing or tabs detected');
  }
  
  if (text.length < 500) {
    formattingScore -= 15;
    formattingIssues.push('Resume appears too short');
  }
  
  const readabilityScore = Math.min(Math.max(60, 100 - (totalWords > 1000 ? 15 : 0) - (totalWords < 300 ? 20 : 0)), 100);
  const readabilityIssues: string[] = [];
  
  if (totalWords > 1000) {
    readabilityIssues.push('Resume is quite lengthy - consider condensing');
  }
  if (totalWords < 300) {
    readabilityIssues.push('Resume is too brief - add more detail');
  }
  
  const overallScore = Math.round(
    (keywordScore * 0.35 + structureScore * 0.25 + formattingScore * 0.25 + readabilityScore * 0.15)
  );

  // Generate targeted improvements
  const improvements = [];
  
  if (foundKeywords.length < 10) {
    improvements.push({
      type: 'critical' as const,
      title: 'Insufficient Keywords',
      description: `Only ${foundKeywords.length} relevant keywords found. Add more ${detectedIndustry} keywords like: ${missingKeywords.slice(0, 8).join(', ')}`,
      impact: `+${Math.round((15 - foundKeywords.length) * 2)} ATS Score`
    });
  }
  
  if (structureScore < 80) {
    improvements.push({
      type: 'warning' as const,
      title: 'Missing Critical Sections',
      description: `Add these important sections: ${missingCriticalSections.slice(0, 3).join(', ')}`,
      impact: `+${Math.round((80 - structureScore) * 0.25)} ATS Score`
    });
  }
  
  if (keywordDensity < 1.5) {
    improvements.push({
      type: 'suggestion' as const,
      title: 'Low Keyword Density',
      description: 'Naturally incorporate more relevant keywords throughout your resume content.',
      impact: '+5 ATS Score'
    });
  }
  
  if (formattingIssues.length > 0) {
    improvements.push({
      type: 'warning' as const,
      title: 'Formatting Issues Detected',
      description: formattingIssues.join('; '),
      impact: '+8 ATS Score'
    });
  }
  
  if (!text.toLowerCase().includes('achievement') && !text.toLowerCase().includes('result')) {
    improvements.push({
      type: 'suggestion' as const,
      title: 'Add Quantified Achievements',
      description: 'Include specific metrics and results (e.g., "Increased efficiency by 25%", "Managed team of 8")',
      impact: '+7 ATS Score'
    });
  }

  // Generate realistic job matches based on found keywords
  const jobMatches = [
    {
      title: `Senior ${detectedIndustry === 'technology' ? 'Software Developer' : detectedIndustry.charAt(0).toUpperCase() + detectedIndustry.slice(1) + ' Specialist'}`,
      match: Math.min(Math.max(overallScore + Math.floor(Math.random() * 10) - 5, 45), 95),
      company: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta'][Math.floor(Math.random() * 5)],
      location: ['Remote', 'San Francisco, CA', 'Seattle, WA', 'New York, NY'][Math.floor(Math.random() * 4)],
      requirements: foundKeywords.slice(0, 6)
    },
    {
      title: `${detectedIndustry === 'technology' ? 'Full Stack Engineer' : detectedIndustry.charAt(0).toUpperCase() + detectedIndustry.slice(1) + ' Manager'}`,
      match: Math.min(Math.max(overallScore - 8 + Math.floor(Math.random() * 8), 40), 90),
      company: ['Netflix', 'Spotify', 'Uber', 'Airbnb', 'Tesla'][Math.floor(Math.random() * 5)],
      location: ['Remote', 'Austin, TX', 'Boston, MA', 'Los Angeles, CA'][Math.floor(Math.random() * 4)],
      requirements: foundKeywords.slice(0, 5)
    },
    {
      title: `Lead ${detectedIndustry === 'technology' ? 'Frontend Developer' : detectedIndustry.charAt(0).toUpperCase() + detectedIndustry.slice(1) + ' Analyst'}`,
      match: Math.min(Math.max(overallScore - 15 + Math.floor(Math.random() * 10), 35), 85),
      company: ['Salesforce', 'Adobe', 'Oracle', 'IBM', 'Intel'][Math.floor(Math.random() * 5)],
      location: ['Remote', 'Chicago, IL', 'Denver, CO', 'Atlanta, GA'][Math.floor(Math.random() * 4)],
      requirements: foundKeywords.slice(0, 4)
    },
    {
      title: `${detectedIndustry === 'technology' ? 'DevOps Engineer' : detectedIndustry.charAt(0).toUpperCase() + detectedIndustry.slice(1) + ' Coordinator'}`,
      match: Math.min(Math.max(overallScore - 20 + Math.floor(Math.random() * 12), 30), 80),
      company: ['GitHub', 'Atlassian', 'Slack', 'Zoom', 'Dropbox'][Math.floor(Math.random() * 5)],
      location: ['Remote', 'Portland, OR', 'Miami, FL', 'Phoenix, AZ'][Math.floor(Math.random() * 4)],
      requirements: foundKeywords.slice(0, 3)
    }
  ];

  return {
    overallScore,
    sections: {
      formatting: {
        score: formattingScore,
        issues: formattingIssues,
        recommendations: [
          'Use standard fonts (Arial, Calibri, Times New Roman)',
          'Avoid tables, text boxes, and graphics',
          'Use consistent formatting throughout',
          'Save as PDF to preserve formatting'
        ]
      },
      keywords: {
        score: keywordScore,
        found: foundKeywords,
        missing: missingKeywords.slice(0, 15),
        density: Math.round(keywordDensity * 100) / 100,
        locations: keywordLocations
      },
      structure: {
        score: structureScore,
        sections: detectedSections,
        missingCritical: missingCriticalSections
      },
      readability: {
        score: readabilityScore,
        issues: readabilityIssues
      }
    },
    improvements,
    jobMatches,
    extractedText: text,
    wordCount: totalWords
  };
};