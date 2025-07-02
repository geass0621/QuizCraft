# QuizCraft 📝

> A modern questionnaire and quiz platform showcasing full-stack TypeScript development

## 🎯 Project Overview

QuizCraft is a portfolio demo project that demonstrates modern full-stack development skills. Users can create questionnaires, share links with others, and receive email notifications with results after expiration.

**Live Demo:** [Coming Soon]

## ✨ Key Features

- **📊 Two Modes:** Survey collection & Quiz assessment with auto-scoring
- **🔗 Shareable Links:** Anonymous questionnaire creation and sharing
- **⏱️ Real-time Timer:** WebSocket-powered countdown during responses
- **📧 Email Results:** Automatic result delivery when questionnaires expire
- **📱 Mobile Responsive:** Works perfectly on all devices
- **🛡️ Security:** Rate limiting, input validation, and spam protection

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, Vite  
**Backend:** Node.js, Express, TypeScript, Prisma ORM  
**Database:** PostgreSQL (Railway)  
**Real-time:** Socket.io for live features  
**Email:** Nodemailer + Gmail integration  
**Deployment:** Vercel (frontend) + Railway (backend)

## 🏗️ Architecture

```
QuizCraft/
├── backend/           # Node.js API with Express
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Validation & security
│   │   └── socket/        # WebSocket handlers
│   └── prisma/        # Database schema & migrations
└── frontend/          # React TypeScript app
    └── src/
        ├── components/    # Atomic design structure
        ├── hooks/         # Custom React hooks
        └── pages/         # Route components
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Railway account)
- Gmail account for email features

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env    # Add your database URL and email credentials
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🌟 Portfolio Highlights

This project demonstrates:

- **Full-stack TypeScript** with type safety across frontend and backend
- **Modern database design** with Prisma ORM and PostgreSQL
- **Real-time features** using WebSocket connections
- **Email automation** with job scheduling
- **RESTful API design** with proper error handling
- **Responsive UI/UX** with atomic design principles
- **Security best practices** including rate limiting and validation
- **Clean code architecture** with separation of concerns

## 📊 Technical Achievements

- **100% TypeScript** coverage for type safety
- **Sub-2s page load** times with performance optimization
- **Mobile-first design** with perfect responsiveness
- **Production-ready** deployment with CI/CD pipeline
- **Clean Git history** with conventional commit messages

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome! Feel free to open issues or submit PRs.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ as a portfolio project to showcase modern full-stack development skills.**
