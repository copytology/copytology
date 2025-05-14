
# Frontend Implementation Plan

## Overview

The frontend codebase already has the basic structure in place with:
- Authentication (Login/Register)
- Main app layout with Navbar and Footer
- Dashboard, Challenge, and History pages (UI only)

We need to connect these components to the Supabase backend and implement the AI-powered challenge system.

## Component Updates Needed:

### 1. AuthContext Updates
- Store user level and XP information
- Load user profile data on login

### 2. Dashboard Updates
- Fetch real challenges from Supabase instead of mock data
- Implement "Refresh Challenges" button functionality to generate new challenges
- Display correct user level and XP from profile data

### 3. Challenge Page Updates
- Connect to real challenge data from Supabase
- Implement submission scoring using the Edge Function
- Display real-time results and XP gains
- Animate level-ups when they occur

### 4. History Page Updates 
- Fetch real submission history from Supabase
- Filter by challenge type, date, etc.
- Pagination for large history lists

### 5. Profile Page (to be created)
- Display user statistics
- Show level progression
- Visualize writing improvement over time
- Achievement badges

## API Service Implementation

Create a central API service to manage Supabase interactions:

```typescript
// src/services/api.ts
import { supabase } from '@/integrations/supabase/client';

export interface Challenge {
  id: string;
  type: 'copywriting' | 'content' | 'uxwriting';
  title: string;
  description: string;
  brief: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time_estimate: string;
  guidelines: string[];
  word_limit: number;
  example_prompt?: string;
}

export interface Submission {
  id: string;
  challenge_id: string;
  response: string;
  score: number;
  feedback: string[];
  improvement_tip: string;
  xp_gained: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  current_xp: number;
  level_id: number;
}

export interface Level {
  id: number;
  title: string;
  required_xp: number;
  description: string;
}

export const api = {
  // User profiles
  async getUserProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, levels:level_id(title, required_xp, description)')
      .eq('id', supabase.auth.getUser()?.data.user?.id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Challenges
  async getUserChallenges() {
    const { data, error } = await supabase
      .from('user_challenges')
      .select(`
        challenge_id,
        status,
        challenges:challenge_id(*)
      `)
      .eq('user_id', supabase.auth.getUser()?.data.user?.id)
      .eq('status', 'active');
      
    if (error) throw error;
    return data.map(item => ({
      ...item.challenges,
      status: item.status
    }));
  },
  
  async refreshChallenges() {
    const { data, error } = await supabase.functions.invoke('generate-challenges');
    if (error) throw error;
    return data;
  },
  
  async getChallenge(id: string) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Submissions
  async submitChallenge(challengeId: string, submission: string) {
    const { data, error } = await supabase.functions.invoke('score-submission', {
      body: { challengeId, submission }
    });
    
    if (error) throw error;
    return data;
  },
  
  async getUserSubmissions() {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        challenges:challenge_id(title, type, difficulty)
      `)
      .eq('user_id', supabase.auth.getUser()?.data.user?.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Levels
  async getLevels() {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('required_xp', { ascending: true });
      
    if (error) throw error;
    return data;
  },
  
  async getNextLevel(currentLevelId: number) {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .gt('id', currentLevelId)
      .order('id', { ascending: true })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned"
    return data;
  }
};
```

## Example Data State Flow

1. **User Login**:
   - Auth state changes in AuthContext
   - Profile data loaded from Supabase
   - Redirect to Dashboard

2. **Dashboard Load**:
   - Check if user has active challenges
   - If not, call `refreshChallenges()` to generate new ones
   - Display challenges from Supabase

3. **Challenge Attempt**:
   - User writes submission
   - On submit, call `submitChallenge()`
   - Display score, feedback, and XP gain
   - Update user's XP and potentially level

4. **History View**:
   - Load submission history with `getUserSubmissions()`
   - Allow filtering and sorting 

## Profile Data Synchronization

Whenever the user's profile data needs to be updated (after a submission):

```typescript
// In the Challenge component after successful submission
const { result } = await api.submitChallenge(challengeId, submission);
// Get updated profile data to reflect XP changes
const updatedProfile = await api.getUserProfile();
updateUserContext(updatedProfile); // Update global auth context
```
