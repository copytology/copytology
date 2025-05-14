
# Implementation Plan: Copytology 

## Phase 1: MVP

**Goals:**

* Core user flows
* AI-powered challenge loop
* Foundational gamification

**Tasks:**

* **Set Up Supabase Backend**
    * Auth (email/password)
    * Tables: users, challenges, submissions, levels
* **Frontend Dashboard**
    * Display 10 active challenges
    * Challenge view + submission input
    * Show score and feedback after submit
    * History page for completed challenges
* **AI Integration (GPT-4.1)**
    * Generate 10 challenges on first login
    * Score submissions (1–100) + generate feedback
    * Scale difficulty based on user level
* **Gamification System**
    * Track XP and level-up logic
    * XP earned per challenge
    * Display current level + XP bar
* **Basic Static Content**
    * Landing page, About, Level System explainer
* **Responsive UI**
    * Mobile-first design using Tailwind CSS

## Phase 2: V1 Launch

**Goals:**

* Monetization
* Refined user experience

**Tasks:**

* **Integrate MidTrans Payments**
    * Payment page + webhook listener
    * Premium tiers or unlockables
* **Advanced AI Logic**
    * Smarter prompt generation based on progress
    * Level-based difficulty parameters
* **Polish Gamification UI**
    * Level-up animations
    * XP badges or streaks
* **Enhanced Feedback Display**
    * Feedback formatting, tone enhancements
