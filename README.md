# 🚀 AI Resume Architect

**AI Resume Architect** is a premium, 6-step multi-wizard resume generator designed to transform your career details into professional, high-impact resumes using AI. 

![Premium Design](https://img.shields.io/badge/Design-Glassmorphic-purple)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Gemini-blue)

## ✨ Features

- **6-Step Professional Wizard**: Granular data collection covering Contact, Socials, Professional Core, Experience, Education, and Achievements.
- **AI Content Generation**: Leverages Google Gemini to architect professional summaries and experience bullet points.
- **Live Preview & Export**: Real-time resume preview with instant PDF and JSON download capabilities.
- **Premium UI**: Sleek, glassmorphic dark-mode interface with smooth animations and responsive layouts.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-resume-generator.git
cd ai-resume-generator
```

### 2. Backend Setup (Root Folder)
The backend handles the AI generation and PDF logic.

```bash
# Install dependencies
npm install

# Create environment file
touch .env
```

Add your Gemini API key to the `.env` file:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup (`/frontend` Folder)
The frontend provides the premium wizard experience.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will now be running at **http://localhost:5173**.

---

## 🏗️ Technology Stack

- **Frontend**: React.js, Vite, Lucide Icons, html2canvas, jsPDF.
- **Backend**: Node.js, Express, Google Generative AI (Gemini Pro).
- **Styling**: Vanilla CSS (Custom Glassmorphism System).

## 📄 License

This project is licensed under the MIT License.