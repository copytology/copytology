
# Copytology - Masterplan

## App Overview and Objectives

Copytology is a gamified, AI-powered learning app that helps career switchers break into copywriting, content writing, and UX writing. Users complete dynamic writing challenges that are automatically graded with feedback. As they progress, they earn XP and climb a themed career ladder — from Intern all the way to CMO.

## Target Audience

* Adults switching careers into writing or marketing
* Learners seeking a structured, interactive way to build writing skills
* People exploring copywriting, UX writing, or content marketing

## Core Features and Functionality

* AI-generated writing challenges across 3 disciplines: Copywriting, Content Writing, UX Writing
* Scoring system (1–100) with GPT-4.1 generated feedback
* Always-available dashboard with 10 active challenges
* Challenge history with saved responses and scores
* XP system that ties to gamified levels:
  Intern → Trainee → Junior Associate → Associate → Senior Associate → Team Lead → Manager → Director → VP → CMO
* Responsive design, mobile-friendly
* Supabase-based email login & user management
* Local payment integration (MidTrans) for premium access

## High-Level Technical Stack Recommendations

* **Frontend:** React (Next.js or Remix), Tailwind CSS
* **Backend:** Supabase (auth, database, API)
* **AI Layer:** GPT-4.1 API for challenge generation + scoring
* **Payments:** MidTrans (local Indonesian payment gateway)
* **Hosting:** Vercel or Netlify for frontend, Supabase for backend

## Conceptual Data Model

* **Users**: email, name, XP, level, current challenges
* **Challenges**: type, prompt, difficulty, generatedAt
* **Submissions**: userId, challengeId, response, score, feedback, timestamp
* **Levels**: title, requiredXP
* **Payments**: userId, tier, transactionId, status

## User Interface Design Principles

* Bright, approachable, confidence-boosting
* \#9fc131 as primary brand color
* Gamified elements (level bars, XP counters)
* Clear feedback display after each submission
* Smooth animations and playful UI for level ups
* Responsive layout for mobile and desktop

## Security Considerations

* Secure email/password auth via Supabase
* Rate limiting for AI API requests
* XSS & input sanitation for challenge answers
* Secure handling of payment data through MidTrans

## Development Phases or Milestones

1. **MVP:** User auth, dashboard with dynamic challenges, AI scoring, history, basic gamification
2. **V1:** Payment integration, full level system, challenge difficulty scaling
3. **V2:** More personalization, user stats, optional writing tips, improved CMS for static content

## Potential Challenges and Solutions

* **AI Cost Control:** Use GPT efficiently with batching and prompt reuse
* **Challenge Quality:** Fine-tune system prompts for consistent challenge formatting
* **Scaling Feedback:** Implement fallback systems if GPT fails or lags

## Future Expansion Possibilities

* Add peer review or community features
* Launch mobile apps
* Build out a course or lesson system
* Offer certification paths or job board for graduates
