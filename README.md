# Fitma.ai

> **Your AI-powered nutrition companion that understands you, reminds you, and helps you build healthier eating habits—without making food tracking feel like work.**

[![License: Private](https://img.shields.io/badge/License-Private-blue.svg)](#)
[![Status: MVP Development](https://img.shields.io/badge/Status-MVP_Development-green.svg)](#)

Fitma.ai is an AI-first nutrition and meal tracking platform designed for people who struggle to maintain healthy eating habits due to busy lifestyles. Unlike traditional calorie tracking apps that require manual logging, Fitma.ai focuses on effortless meal tracking using conversational AI, proactive reminders, and personalized coaching.

At the center of the experience is **Liva**, an intelligent AI nutrition companion that behaves more like a supportive coach than a calorie calculator.

---

## 🎯 The Problem & Our Vision

**The Problem**: Millions of busy professionals and students struggle with consistency. Existing nutrition apps require excessive manual input, long onboarding processes, and offer generic diet plans. *The biggest problem isn't knowing what to eat—it's actually following healthy habits consistently.*

**Our Vision**: To build the world's most natural AI nutrition companion that seamlessly integrates into everyday life. Instead of forcing users to adapt to the application, Fitma.ai adapts to the user.

## ✨ Core Features (MVP)

- 🤖 **Liva AI Companion**: Log meals through natural conversation. Say *"Liva, I just had two rotis, dal, and rice,"* and Liva automatically estimates nutrition, updates daily calories, and tracks macros.
- 🧠 **Dynamic AI Memory & Context**: Liva is specially tuned with deep Indian nutritional context and remembers your preferences across sessions.
- ⚡ **Frictionless Onboarding**: Progressive profiling that gets you started in under 2 minutes.
- 📊 **Smart Dashboard**: Track daily calories, protein, water intake, and view AI insights at a glance.
- 🔔 **Cross-Device Notifications**: Smart meal reminders, water reminders, and AI check-ins delivered seamlessly across all your devices using secure token-based push notifications.
- 📈 **Progress Tracking**: Weekly trends, nutrition reports, and streak tracking to build sustainable habits.

## 🛠️ System Architecture & Tech Stack

The current web-based MVP is built using a modern, scalable stack:

- **Frontend**: React 18 (SPA), Vite, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion
- **Backend**: Node.js, Express.js
- **AI Engine**: Google Generative AI (`gemini-3.1-flash-lite`) powering Liva for ultra-fast, intelligent responses
- **Database & Auth**: Firebase (Authentication & Firestore) and MongoDB (via Mongoose)
- **Deployment**: Vercel (Frontend), Render/Heroku (Backend)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- Google Gemini API Key
- Firebase & MongoDB configuration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amishshetty/Fitma.AI.git
   cd Fitma.AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   # Add your Firebase and MongoDB URIs here
   ```

4. **Run the Application**
   - **Frontend**: `npm run dev` (Starts Vite server)
   - **Backend**: `npm run server` (Starts Node/Express API)

## 📁 Project Structure

```text
Fitma.AI/
├── backend/          # Node.js server, controllers, AI chat logic (Liva Brain)
├── docs/             # Product Requirements Documents (PRD) and architecture notes
├── scripts/          # Utility and automation scripts
├── src/              # Frontend React application components and screens
├── tests/manual/     # Isolated API and AI manual testing scripts
└── README.md         # Project documentation
```

## 📈 Roadmap

- **Phase 1 (MVP)**: Conversational meal logging, dashboard, habit tracking, and basic AI coaching.
- **Phase 2**: Image-based food recognition (Gemini Vision), wearable integrations, smart grocery suggestions.
- **Phase 3**: Family accounts, fitness tracking, and advanced health reports.

## 👨‍💻 Author

**Amish Shetty**  
*Product Manager | AI Product Builder*  
Building the future of AI-powered nutrition with Fitma.ai.