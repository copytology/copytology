
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
  challenge?: {
    title: string;
    type: string;
    difficulty: string;
  };
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  current_xp: number;
  level_id: number;
  levels?: Level;
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*, levels:level_id(id, title, required_xp, description)')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    return data as UserProfile;
  },
  
  // Challenges
  async getUserChallenges() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('user_challenges')
      .select(`
        id,
        status,
        challenge:challenge_id(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active');
      
    if (error) throw error;
    return data.map(item => ({
      ...item.challenge,
      status: item.status
    })) as Challenge[];
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
    return data as Challenge;
  },
  
  // Submissions
  async submitChallenge(challengeId: string, submission: string) {
    const { data, error } = await supabase.functions.invoke('score-submission', {
      body: { challengeId, submission }
    });
    
    if (error) {
      console.error("Submission error:", error);
      throw error;
    }
    return data;
  },
  
  async getUserSubmissions() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        challenge:challenge_id(title, type, difficulty)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Submission[];
  },
  
  // Levels
  async getLevels() {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('required_xp', { ascending: true });
      
    if (error) throw error;
    return data as Level[];
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
    return data as Level;
  }
};
