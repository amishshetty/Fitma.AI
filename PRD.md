# PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Fitma.ai - Your Personal AI Health Companion**

---
- **Document Version:** 1.0
- **Prepared By:** Product Management (Amish Shetty)
- **Document Status:** Draft
- **AI Assistant:** Liva
- **Platforms:** Android (MVP), iOS (Phase 2), Web Dashboard (Future)
- **Document Type:** Product Requirements Document (PRD)

---

## Table of Contents
1. Document Information
2. Executive Summary
3. Product Vision
4. Problem Statement
5. Product Objectives
6. Business Goals
7. System Architecture & Tech Stack
8. Target Audience
9. User Personas
10. User Journey Maps
11. Product Scope
12. Feature Overview
13. Functional Requirements
14. AI Product Requirements
15. Non-Functional Requirements
16. Information Architecture
17. Screen List
18. Wireframe Specifications
19. Database Requirements
20. API Requirements
21. Analytics & Success Metrics
22. MVP Definition
23. Future Roadmap
24. Risks & Assumptions
25. Conclusion
26. Appendix

---

## 1. Document Information

| Field | Details |
| :--- | :--- |
| **Product Name** | Fitma.ai |
| **AI Assistant** | Liva |
| **Version** | 1.0 |
| **Document Type** | Product Requirements Document |
| **Document Owner** | Product Management (Amish Shetty) |
| **Status** | Draft |
| **Target Release** | MVP |
| **Platforms** | Android (Primary), iOS (Future), Web Dashboard (Future) |
| **Primary Audience** | Product Team, Design Team, Engineering Team, QA Team, Stakeholders |

---

## 2. Executive Summary

### Overview
Fitma.ai is an AI-powered, voice-first health companion designed to help users build and maintain healthy eating habits with minimal effort. Unlike traditional calorie-tracking applications that rely heavily on manual input, Fitma.ai enables users to interact naturally through voice, receive proactive reminders, and obtain personalized nutritional guidance throughout the day.

The application leverages Artificial Intelligence to understand user behaviour, remember eating patterns, recommend healthy meals, and provide continuous coaching. It acts as a personal dietitian that not only tracks nutrition but also actively supports users in making healthier choices.

At the heart of Fitma.ai is **Liva**, an intelligent AI health companion that interacts with users through natural conversations. Rather than expecting users to remember to log meals, Liva proactively reminds them, understands their eating habits, answers nutrition-related questions, and provides personalized coaching throughout the day.

The long-term vision is to transform diet management from a manual tracking process into a seamless conversational experience where users can simply speak to Liva as they would to a personal nutrition coach.

### Purpose
The purpose of Fitma.ai is to simplify healthy living by reducing the effort required to manage nutrition and diet. The application aims to help users stay accountable to their health goals through intelligent automation, personalized recommendations, and proactive engagement. Rather than focusing only on calorie counting, Fitma.ai aims to build long-term healthy habits by making nutrition tracking effortless, conversational, and personalized.

### Value Proposition
Fitma.ai offers users a personalized AI-powered health companion that:
- Simplifies meal tracking using natural voice commands.
- Automatically calculates calories and nutritional values.
- Provides intelligent reminders for meals and hydration.
- Learns user habits and offers personalized recommendations.
- Tracks long-term nutrition trends and health progress.
- Encourages sustainable healthy habits instead of restrictive dieting.
- Provides instant answers to nutrition-related questions.
- Helps users make informed food choices based on their remaining calorie allowance and health goals.

---

## 3. Product Vision
Fitma.ai envisions a future where maintaining a healthy lifestyle becomes effortless through intelligent AI assistance. Instead of requiring users to manually log meals or navigate through multiple screens, the application enables them to manage their entire diet using simple and natural voice conversations with Liva.

Liva is designed to function as a personal AI dietitian that stays with the user throughout the day. Users can simply say, *"Liva, I just had two rotis, dal, and one bowl of rice."* Liva will automatically understand the meal, calculate nutritional values, estimate calories, record the meal, and update the user's daily nutrition log without requiring any manual effort.

Unlike traditional diet applications, Fitma.ai is designed to proactively engage with users rather than waiting for them to open the application. If a user forgets to eat, skips a meal, or forgets to log their food intake, Liva will initiate conversations through intelligent reminders and contextual prompts.

**Examples include:**
- *"Good Morning! Don't forget to have your breakfast."*
- *"Did you have your lunch today?"*
- *"You're running behind your water intake goal."*
- *"It's almost dinner time. Don't forget to log your meal."*

Beyond tracking meals, Fitma.ai acts as an intelligent nutrition coach. If a user asks, *"Liva, I'm feeling hungry. What can I eat?"* Liva will analyze:
- Remaining calories
- Protein target
- Daily nutritional balance
- User preferences
- Dietary restrictions
- Previous meals
- Health goals

Based on this information, Liva will recommend healthy meal options while explaining how each option contributes toward the user's nutrition goals.

The application also supports cheat meals without discouraging users. Rather than creating guilt, Liva promotes balance by recording cheat meals, adjusting calorie calculations, and encouraging users to return to their healthy routine.

Users can also interact naturally with their nutrition history by asking questions such as:
- *"What did I eat last Tuesday?"*
- *"How many calories did I consume yesterday?"*
- *"How much protein have I consumed this week?"*

Liva should function as a conversational memory for the user's health journey. Another key aspect of the vision is proactive coaching. Instead of only responding to commands, Liva should identify eating patterns and provide meaningful health insights.

**For example:**
- *"You've skipped breakfast three days in a row."*
- *"Your protein intake has been low this week."*
- *"You've exceeded your calorie goal for two consecutive days."*
- *"Great job! You've met your nutrition goals for five days straight."*

The ultimate vision of Fitma.ai is not to become another calorie-tracking application but to become an AI health companion that understands users, learns their habits, motivates them, and helps them build healthier lifestyles through continuous personalized support.

---

## 4. Problem Statement
**Samar** is a 26-year-old working professional with a busy and unpredictable schedule. Long working hours, frequent meetings, and personal responsibilities leave him with very little time to focus on maintaining a healthy lifestyle. As a result, he often skips meals, eats unhealthy food due to convenience, and struggles to maintain consistent meal timings.

Although Samar wants to improve his health and manage his weight, he finds it difficult to consistently track his daily food intake and nutritional consumption. He often forgets what he has eaten throughout the day and lacks a simple way to understand whether he is meeting his calorie and nutrition goals.

While several diet and fitness applications are available, most require extensive manual effort to log meals, provide generic recommendations, and fail to adapt to his daily routine. This makes the process time-consuming and difficult to sustain, causing Samar to lose motivation and eventually stop using these applications.

Over time, these inconsistent eating habits have contributed to weight gain, reduced energy levels, poor dietary consistency, and lower productivity. Samar needs a simple, personalized, and effortless way to stay accountable to his nutrition goals and build healthier eating habits without adding extra complexity to his already busy lifestyle.

---

## 5. Product Objectives

### Primary Objectives
- Simplify meal tracking through natural voice interactions.
- Reduce manual effort involved in calorie and nutrition tracking.
- Help users build sustainable healthy eating habits.
- Improve long-term user engagement through proactive AI coaching.
- Provide personalized nutrition guidance based on user goals.
- Build an AI companion that users can rely on every day.

### Secondary Objectives
- Improve awareness of daily nutritional intake.
- Encourage healthier food choices.
- Increase consistency through intelligent reminders.
- Enable users to easily access historical meal data.
- Support users with contextual dietary recommendations.
- Increase motivation through personalized coaching and positive reinforcement.

---

## 6. Business Goals

### Short-Term Goals
- Launch a functional MVP with core AI capabilities.
- Achieve strong user engagement through voice-first interactions.
- Validate product-market fit.
- Collect user feedback for iterative improvements.
- Establish Fitma.ai as a differentiated AI-first health application.

### Long-Term Goals
- Become the preferred AI-powered nutrition companion.
- Expand into preventive healthcare and holistic wellness.
- Integrate with wearable devices and health ecosystems.
- Build a scalable AI platform for personalized health management.
- Expand globally through localization and multilingual AI support.
- Introduce advanced AI capabilities for predictive health coaching.

---

## 7. System Architecture & Tech Stack
- **Frontend Layer:** React 18 (SPA), Vite, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion.
- **Backend/API Layer:** Node.js, Express.js. API routes under `/api`.
- **AI Integration Layer:** Google Generative AI (Gemini) SDK.
- **Data Persistence Layer:** Firebase (Auth & Firestore) combined with MongoDB (via Mongoose) for complex document storage.
- **Hosting:** Vercel (Frontend) and Render/Heroku (Backend).

---

## 8. Target Audience

### Primary Users
- Working professionals with busy schedules.
- Individuals aiming for weight management.
- Fitness enthusiasts.
- People seeking healthier eating habits.
- Individuals looking for a convenient AI-powered health assistant.

### Secondary Users
- Students.
- Busy parents.
- Individuals following medical diets.
- Senior citizens requiring meal reminders.
- Beginners starting their health and fitness journey.

---

## 9. User Personas

To ensure Fitma.ai addresses the needs of different user groups, five primary personas have been identified.

### Persona 1 – Samar (Busy Working Professional)
- **Age:** 27 Years
- **Occupation:** Software Engineer
- **Lifestyle:** Busy Corporate Professional (9–10 Hours Daily)
- **Tech Proficiency:** High
- **Health Goal:** Lose Weight & Stay Healthy
- **Pain Points:** Frequently skips meals, eats unhealthy food, forgets to log meals, finds existing diet apps time-consuming.
- **Needs:** Voice meal logging, smart reminders, AI coaching, personalized meal recommendations, daily progress tracking.

### Persona 2 – Priya (Fitness Enthusiast)
- **Age:** 25 Years
- **Occupation:** Marketing Executive
- **Workout:** 5 Days a Week
- **Goal:** Muscle Gain
- **Tech Proficiency:** High
- **Pain Points:** Manual logging takes time, macro calculations are tedious, hard to track restaurant meals.
- **Needs:** AI macro calculations, protein tracking, smart meal suggestions, voice logging.

### Persona 3 – Rahul (College Student)
- **Age:** 21 Years
- **Occupation:** Student
- **Goal:** Healthy Lifestyle
- **Pain Points:** Irregular meals, limited healthy food options, doesn't know nutritional values.
- **Needs:** Affordable meal suggestions, daily reminders, easy meal logging, nutrition education.

### Persona 4 – Sneha (Working Mother)
- **Age:** 34 Years
- **Occupation:** HR Manager
- **Goal:** Maintain Family Health
- **Pain Points:** Busy schedule, misses meals, difficult to track nutrition consistently.
- **Needs:** Meal reminders, family meal planning (Future), quick logging, personalized coaching.

### Persona 5 – Rajesh (Senior Citizen)
- **Age:** 62 Years
- **Occupation:** Retired
- **Goal:** Manage Diabetes
- **Pain Points:** Forgetfulness, complex mobile applications, limited understanding of nutrition labels.
- **Needs:** Large/simple UI, voice interaction, medication support (Future), meal reminders.

---

## 10. User Journey Maps

### Journey 1 – Daily Healthy Routine
`Wake Up` ➔ `Liva greets the user` ➔ `Breakfast Reminder` ➔ `User logs breakfast using voice` ➔ `Calories updated automatically` ➔ `Lunch Reminder` ➔ `Meal logged` ➔ `Snack Recommendation` ➔ `Dinner Reminder` ➔ `Daily Nutrition Summary` ➔ `Weekly Progress Updated`

### Journey 2 – Voice Meal Logging
`User Speaks: "Liva, I had two rotis and dal."` ➔ `Speech converted to text` ➔ `Meal identified` ➔ `Nutrition calculated` ➔ `Calories logged` ➔ `Confirmation shown`

### Journey 3 – Smart Recommendation
`User says: "I'm hungry."` ➔ `Liva checks (Remaining Calories, Protein, Previous Meals, Health Goals, Preferences)` ➔ `Suggests Healthy Foods` ➔ `User selects option` ➔ `Meal Logged`

### Journey 4 – Missed Meal
`Meal Time` ➔ `No Meal Logged` ➔ `Liva Detects Missed Meal` ➔ `Reminder Sent` ➔ `User Updates Meal` ➔ `Calories Updated` ➔ `Daily Progress Updated`

### Journey 5 – Daily Summary
`End of Day` ➔ `Analyze Daily Nutrition (Calories, Protein, Water, Meal Timings)` ➔ `Healthy Score` ➔ `AI Insights` ➔ `Tomorrow's Suggestions`

---

## 11. Product Scope

### In Scope (MVP)
**User Management**
- User registration and authentication
- Profile management & Goal setting
- Height, weight, age management
- Dietary preference configuration

**Nutrition Management**
- Voice & Manual meal logging
- Calorie & Macro tracking
- Daily, Weekly, Monthly reports
- Cheat meal & Water intake tracking

**AI Capabilities**
- Voice interaction through Liva
- AI-powered nutrition analysis & recommendations
- Smart reminders & Daily/Weekly summaries
- Personalized coaching & Habit learning (basic)

**Analytics**
- Daily calorie intake & Macro breakdown
- Nutrition trends, Goal progress, Consistency tracking & Streaks

### Out of Scope (MVP)
- Direct consultation with certified dietitians
- Food delivery & Grocery shopping integration
- Smart kitchen appliance & Wearable device synchronization
- Medical diagnosis & Medication management
- AI image-based food recognition & Barcode scanner

---

## 12. Feature Overview

- **Module 1 – Authentication & User Management:** User Sign Up, Login, Profile Management, Goal Setup, Health Profile.
- **Module 2 – AI Assistant (Liva):** Voice Conversations, NLU, Context Awareness, Personalized Coaching, Reminders.
- **Module 3 – Meal Tracking:** Voice/Manual Meal Logging, Calorie/Macro Tracking, Cheat Meal Logging, Favorite Meals.
- **Module 4 – Smart Recommendations:** Meal/Snack Suggestions, Healthy Alternatives, Protein Gap Recommendations.
- **Module 5 – Health Analytics:** Dashboards (Daily/Weekly/Monthly), Calorie/Protein Trends, Habit Tracking, Health Score.

---

## 13. Functional Requirements

### Module 1 – User Registration & Authentication
- **FR-001 (User Registration):** Create account using email, mobile (OTP), Google, Apple. Unique email/mobile, OTP expires in 5 mins.
- **FR-002 (Login):** Existing users securely log in.

### Module 2 – User Profile
- **FR-003 (Profile Setup):** Configure personal health profile (Name, Age, Gender, Height, Weight, Goal, Activity Level, Allergies).

### Module 3 – Voice Meal Logging
- **FR-004 (Voice Meal Logging):** Users log meals using natural voice conversations. (e.g., "Liva, I had two rotis, dal and rice"). AI estimates quantities, timestamps, and calculates calories.
- **FR-005 (Manual Meal Logging):** Users manually search and log meals.

### Module 4 – AI Conversations
- **FR-006 (AI Health Assistant - Liva):** Liva acts as a conversational AI companion. Responds to historical queries, nutrition advice, and provides positive reinforcement.

### Module 5 – Meal Recommendations
- **FR-007 (Smart Meal Recommendation):** Suggests meals based on remaining calories, protein requirement, preferences, and goals.

### Module 6 – Smart Reminder Engine
- **FR-008 (Meal Reminder):** Proactively reminds users to eat/drink water based on habits.
- **FR-009 (Smart Habit Detection):** Learns eating habits (e.g., skipped breakfast, late dinners).

### Module 7 – Daily Health Summary
- **FR-010 (Daily Summary):** Every night, Liva generates a summary (Calories, Protein, Water, Health Score, Suggestions).

### Module 8 – Historical Search
- **FR-011 (Meal History):** Ask historical questions (e.g., "What did I eat on Monday?").

### Module 9 – Cheat Meal Management
- **FR-012 (Cheat Meal Tracking):** Record cheat meals. Liva responds positively to encourage consistency without shaming.

### Module 10 – Health Dashboard
- **FR-013 (Dashboard):** Displays Today's Calories, Remaining Calories, Protein, Water, Goal Progress, AI Suggestions.

---

## 14. AI Product Requirements

### AI Responsibilities & Capabilities
- Understand, Remember, Recommend, Coach, Motivate, Learn, Predict, Encourage.
- Voice Understanding, Natural Conversations, Context Awareness.
- **Memory:** Remember User Profile, Goals, Medical Preferences, Allergies, Favourite Meals, Previous Conversations.

### Nutrition Intelligence & Behaviour Analysis
- Estimate Calories & Macros, Suggest Meals.
- Detect skipped meals, late eating, cheat patterns, protein deficiency.

### AI Guardrails
- **Must never:** Shame users, diagnose diseases, replace doctors, recommend dangerous diets or unsafe calorie deficits.
- **Should always:** Encourage users, promote balanced eating, motivate positive behavior.

### AI Personality
- Friendly, Supportive, Positive, Encouraging, Professional, Conversational. Never robotic or judgmental.

---

## 15. Non-Functional Requirements

### 15.1 Performance Requirements
- **App Launch Time:** ≤ 3 Seconds
- **Login Response:** ≤ 2 Seconds
- **Voice Processing:** ≤ 5 Seconds
- **AI Response Time:** ≤ 4 Seconds

### 15.2 Other NFRs
- **Availability:** 99.9% uptime, Cloud-based infrastructure.
- **Scalability:** Horizontal scaling, microservice-ready architecture.
- **Security & Privacy:** JWT Authentication, End-to-End Encryption, HTTPS, User Consent Management.
- **Reliability & Accessibility:** Automatic Retry, Voice Navigation, Large Text Support.
- **Compatibility:** Android 10+, iOS 16+.
- **Localization:** Future support for multiple languages (Hindi, Marathi, etc.).
- **Battery Optimization:** Efficient background services.

---

## 16. Information Architecture
- **Authentication:** Login, Register, OTP, Forgot Password
- **Onboarding:** Personal Details, Health Profile, Goals, Dietary Preferences, AI Introduction (Liva)
- **Home Dashboard:** Today's Progress, Remaining Calories, Water Intake, AI Suggestions, Meal Timeline, Quick Actions
- **Voice Assistant (Liva):** Chat, Voice, History, Recommendations
- **Meals:** Breakfast, Lunch, Snacks, Dinner, Cheat Meals
- **Analytics:** Daily, Weekly, Monthly, Nutrition, Habits
- **Notifications**
- **Profile:** Goals, Preferences, Health Data, Account
- **Settings:** Notifications, Voice, Privacy, Security, About

---

## 17. Screen List
The MVP is expected to include 45–60 screens, categorized into Authentication, Onboarding, Home, Voice Assistant, Meals, Analytics, Profile, and Settings.

---

## 18. Wireframe Specifications
**Example Screen: Dashboard**
- **Purpose:** Quick overview of today's health progress.
- **Components:** Greeting from Liva, Calories Consumed/Remaining, Water, AI Recommendations, Quick Voice Button.

**Example Screen: Voice Assistant**
- **Purpose:** Natural interaction with Liva.
- **Components:** Voice Wave Animation, Conversation, Suggested Prompts, Microphone Button.

---

## 19. Database Requirements
- **Core Entities:** User, Meals, Food Items, Nutrition Summary, Goals, Conversations, Notifications, Reports.
- **Relationships:** User ➔ Meals, Goals, Reports, Conversations, Notifications, Preferences.

---

## 20. API Requirements
- **Authentication APIs:** Register, Login, Logout, Forgot Password, Refresh Token.
- **User APIs:** Get Profile, Update Profile, Update Goals.
- **Meal APIs:** Add, Update, Delete, History, Search.
- **AI APIs:** Voice Processing, Chat with Liva, Meal Recommendation, Summaries, Habit Detection.
- **Dashboard APIs:** Daily/Weekly/Monthly Analytics.
- **Notification APIs:** Send/Update/Snooze Reminder.

---

## 21. Analytics & Success Metrics
- **North Star Metric:** Weekly Healthy Days per Active User (WHD/AU)
- **Business KPIs (MVP Target):** 10,000+ Sign-ups, ≥70% Activation Rate, CSAT ≥4.5/5.
- **Product KPIs:** Growing DAU/MAU, Day-7 Retention ≥40%, Voice Logging Adoption ≥60%.
- **AI Performance KPIs:** Voice & Food Recognition Accuracy, AI Response Time, Recommendation Acceptance Rate.

---

## 22. MVP Definition
**P0 – Must Have:** Authentication, User Profile, Meal Tracking (Voice/Manual, Calories/Macros), AI Liva (Voice Conversations, Nutrition Analysis, Smart Reminders), Dashboard.
**P1 – Should Have:** Weekly/Monthly Reports, Habit Detection, Cheat Meal Tracking, AI Coaching, Achievement Badges.
**P2 – Could Have:** Image-based Food Recognition, Barcode Scanner, Wearable Integration, Family Profiles.

---

## 23. Future Roadmap
- **Phase 1 – MVP:** Auth, Voice Logging, AI Chat, Meal Tracking, Dashboards.
- **Phase 2 – Enhanced Intelligence:** Weekly Reports, Habit Detection, Personalized Coaching.
- **Phase 3 – AI Personalization:** Image Recognition, Smart Grocery, Predictive Meal Planning.
- **Phase 4 – Health Ecosystem:** Wearables, Sleep/Fitness Tracking, Family Accounts.
- **Phase 5 – Preventive Healthcare:** Corporate Wellness, Provider Integration, Risk Predictions.

---

## 24. Risks & Assumptions
- **Inaccurate AI meal recognition (High):** Human review options, continuous model improvement.
- **Low user retention (High):** Personalized reminders, gamification, AI coaching.
- **Privacy concerns (High):** Strong encryption, transparent privacy controls.

---

## 25. Conclusion
Fitma.ai aims to redefine diet and nutrition management by introducing Liva, an AI-powered health companion that makes healthy living simple, personalized, and effortless. Through voice-first interactions, intelligent reminders, and proactive coaching, the product focuses on helping users build sustainable healthy habits rather than simply tracking calories.

*"Fitma.ai is not just a diet tracking app—it is your AI health companion, helping you build healthier habits, one conversation at a time."*

---

## 26. Appendix
- **A. Glossary:** Key product, nutrition, AI, and technical terms.
- **B. Abbreviations:** AI, API, KPI, DAU, WAU, MAU, JWT, NLP, STT, TTS, etc.
- **C. Assumptions:** User behavior, AI capabilities, technical considerations.
- **D. Dependencies:** External systems, APIs, cloud services.
- **E. Future Enhancements:** Image-based meal recognition, wearables, grocery assistant.
- **F. References:** User research, competitor analysis, AI design principles.
- **G. Revision History:** Version 1.0 (July 2026).
- **H. Related Documents:** BRD, MRD, APS, TDD, UX/API Docs.
- **I. Sample Liva Conversations:** Recommended flows for meal logging, reminders, and summaries.
