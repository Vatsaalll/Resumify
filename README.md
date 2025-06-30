# Resumify 🚀

**Transform Your Career with AI-Powered Resume Optimization**

Resumify is a comprehensive, production-ready web application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS) and discover relevant job opportunities through intelligent matching algorithms.

![Resumify Screenshot](https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200)

## ✨ Features

### 🎯 Core Functionality
- **Advanced ATS Resume Analysis** - Deep keyword extraction, formatting review, and compatibility scoring
- **AI-Powered Job Matching** - Intelligent job discovery based on resume content and skills
- **LinkedIn Job Search Integration** - Automated job search with Excel export functionality
- **Multi-Format Support** - PDF, DOC, DOCX file processing with robust text extraction
- **Real-time Analysis** - Instant feedback with detailed improvement recommendations

### 🔐 Authentication & Security
- **Supabase Authentication** - Secure user registration and login
- **Row Level Security (RLS)** - Database-level security policies
- **Session Management** - Persistent login state with automatic token refresh
- **Usage Tracking** - Monitor user activity and API usage

### 🎨 User Experience
- **Beautiful Dark/Light Theme** - Seamless theme switching with system preference detection
- **Responsive Design** - Mobile-first approach with perfect tablet and desktop layouts
- **Interactive 3D Background** - Stunning animated isometric cube grid
- **Smooth Animations** - Micro-interactions and hover effects throughout
- **Loading States** - Comprehensive loading indicators and progress tracking

### 📊 Analytics & Insights
- **Detailed Scoring System** - Comprehensive ATS compatibility scoring
- **Keyword Analysis** - Found vs missing keywords with density calculations
- **Structure Assessment** - Resume section detection and recommendations
- **Job Match Scoring** - AI-calculated compatibility percentages
- **Usage Analytics** - Track resume analyses and job searches

### 🛠 Technical Features
- **Modern Tech Stack** - React 18, TypeScript, Tailwind CSS, Vite
- **Database Integration** - Supabase with PostgreSQL backend
- **File Processing** - PDF.js and Mammoth.js for document parsing
- **API Integration** - RESTful API design with Express.js backend
- **Workflow Automation** - n8n integration for job search workflows

## 🚀 Live Demo

**[View Live Application](https://incomparable-palmier-6306bc.netlify.app)**

## 🏗 Architecture

### Frontend Stack
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with comprehensive interfaces
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Vite** - Lightning-fast build tool and development server
- **React Router** - Client-side routing with protected routes

### Backend Stack
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Express.js** - RESTful API server for custom business logic
- **n8n Integration** - Workflow automation for job search processes
- **File Processing** - PDF.js and Mammoth.js for document parsing

### Database Schema
```sql
-- User authentication (handled by Supabase Auth)
auth.users

-- Usage tracking and analytics
usage_logs (
  id, user_id, action_type, resource_id, 
  metadata, ip_address, user_agent, created_at
)

-- API key management
api_keys (
  id, user_id, key_name, key_hash, key_prefix,
  permissions, last_used_at, usage_count, 
  is_active, expires_at, created_at
)
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/resumify.git
cd resumify
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
N8N_WEBHOOK_URL=your_n8n_webhook_url
```

### 4. Database Setup
The database migrations are included in `supabase/migrations/`. Run them in your Supabase dashboard or use the Supabase CLI:
```bash
supabase db push
```

### 5. Start Development Servers
```bash
# Start frontend (Vite dev server)
npm run dev

# Start backend API server (in separate terminal)
npm run server

# Start both concurrently
npm run dev:full
```

### 6. Access the Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## 📁 Project Structure

```
resumify/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AnimatedBackground.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── context/            # React context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/                # Utility libraries
│   │   └── supabase.ts
│   ├── pages/              # Route components
│   │   ├── AuthPage.tsx
│   │   ├── Homepage.tsx
│   │   ├── PricingPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── QAPage.tsx
│   │   └── ResumePage.tsx
│   ├── utils/              # Utility functions
│   │   ├── api.ts
│   │   └── resumeAnalyzer.ts
│   └── App.tsx
├── server/                 # Backend API
│   ├── api.js             # Express server
│   └── resumeATS.py       # Python analysis script
├── supabase/
│   └── migrations/        # Database migrations
├── public/                # Static assets
└── dist/                  # Production build
```

## 🔧 API Endpoints

### Resume Analysis
- `POST /api/resume` - Store resume data
- `GET /api/resume?user_id={id}` - Retrieve resume data
- `POST /api/trigger-job-search` - Trigger LinkedIn job search workflow

### Job Search & Export
- `POST /api/store-sheet` - Store Excel sheet information
- `GET /api/download-sheet?user_id={id}` - Get download URL for job results

### System
- `GET /api/health` - Health check endpoint

## 🎨 Design System

### Color Palette
- **Primary**: Gray scale with gradient accents
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: Inter font family, regular weight
- **Code**: Fira Code, monospace

### Components
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Glass morphism with backdrop blur
- **Forms**: Consistent styling with validation states
- **Navigation**: Fixed header with smooth transitions

## 🔍 Resume Analysis Algorithm

### Keyword Extraction
- Industry-specific keyword databases
- Context-aware keyword detection
- Keyword density calculation
- Missing keyword identification

### ATS Scoring Factors
1. **Keywords (35%)** - Relevant industry keywords found
2. **Structure (25%)** - Critical resume sections present
3. **Formatting (25%)** - ATS-friendly formatting
4. **Readability (15%)** - Content clarity and length

### Job Matching Algorithm
- Skill-based matching with job requirements
- Experience level compatibility
- Location and remote work preferences
- Industry and role alignment

## 🚀 Deployment

### Netlify (Recommended)
The project is configured for easy Netlify deployment:

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Set in Netlify dashboard

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting provider
```

## 🧪 Testing

### Running Tests
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Coverage
- Component rendering tests
- API endpoint testing
- Resume analysis algorithm tests
- Authentication flow tests

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write comprehensive tests
- Update documentation for new features
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure and authentication
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **PDF.js** - PDF processing capabilities
- **Mammoth.js** - Word document processing

## 📞 Support

- **Documentation**: [Project Wiki](https://github.com/yourusername/resumify/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/resumify/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/resumify/discussions)
- **Email**: support@resumify.com

## 🗺 Roadmap

### Version 2.0
- [ ] Advanced AI resume writing assistance
- [ ] Integration with more job boards (Indeed, Glassdoor)
- [ ] Resume template library
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard

### Version 2.1
- [ ] Mobile app (React Native)
- [ ] Chrome extension for LinkedIn
- [ ] API for third-party integrations
- [ ] Multi-language support

---

**Built with ❤️ by the Resumify Team**

*Transform your career today with AI-powered resume optimization!*