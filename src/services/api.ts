
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
  async getUserChallenges(language = 'en') {
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
    
    const challenges = data.map(item => ({
      ...item.challenge,
      status: item.status
    })) as Challenge[];
    
    // No need to translate if already in English or if preserving original language
    if (language === 'en') {
      return challenges;
    }
    
    // For Indonesian, translate challenge titles, descriptions and briefs
    if (language === 'id') {
      // This would ideally call a translation service or get pre-translated content
      // For now, we'll simulate translation with simple dictionary replacements
      return challenges.map(challenge => {
        const translatedType = challenge.type === 'copywriting' 
          ? 'copywriting' 
          : challenge.type === 'content' 
            ? 'konten' 
            : 'UX writing';
            
        return {
          ...challenge,
          title: translate(challenge.title, 'id'),
          description: translate(challenge.description, 'id'),
          brief: translate(challenge.brief, 'id'),
          guidelines: challenge.guidelines.map(g => translate(g, 'id')),
          example_prompt: challenge.example_prompt ? translate(challenge.example_prompt, 'id') : undefined,
          time_estimate: challenge.time_estimate.replace('min', 'menit'),
        };
      });
    }
    
    return challenges;
  },
  
  async refreshChallenges(language = 'en') {
    const { data, error } = await supabase.functions.invoke('generate-challenges', {
      body: { language }
    });
    if (error) throw error;
    return data;
  },
  
  async getChallenge(id: string, language = 'en') {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    const challenge = data as Challenge;
    
    // No translation needed for English
    if (language === 'en') {
      return challenge;
    }
    
    // For Indonesian, translate challenge content
    if (language === 'id') {
      return {
        ...challenge,
        title: translate(challenge.title, 'id'),
        description: translate(challenge.description, 'id'),
        brief: translate(challenge.brief, 'id'),
        guidelines: challenge.guidelines.map(g => translate(g, 'id')),
        example_prompt: challenge.example_prompt ? translate(challenge.example_prompt, 'id') : undefined,
        time_estimate: challenge.time_estimate.replace('min', 'menit'),
      };
    }
    
    return challenge;
  },
  
  // Submissions
  async submitChallenge(challengeId: string, submission: string, language = 'en') {
    const { data, error } = await supabase.functions.invoke('score-submission', {
      body: { challengeId, submission, language }
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
  
  async deleteSubmission(submissionId: string, xpToSubtract: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // Call the stored procedure to delete submission and update user XP
    const { error } = await supabase.rpc('delete_submission_and_update_xp', {
      submission_id: submissionId,
      xp_amount: xpToSubtract
    });
    
    if (error) throw error;
    return true;
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

// Simple translation function (placeholder for real translation service)
function translate(text: string, targetLanguage: string): string {
  if (targetLanguage === 'en') return text;
  
  // This is a very simplified approach - in a real app you would use a proper translation API
  // or have pre-translated content stored in the database
  if (targetLanguage === 'id') {
    // Just a few example replacements to simulate translation
    return text
      .replace(/Write a/gi, 'Tulis sebuah')
      .replace(/Create a/gi, 'Buat sebuah')
      .replace(/Develop a/gi, 'Kembangkan sebuah')
      .replace(/email/gi, 'surel')
      .replace(/content/gi, 'konten')
      .replace(/user/gi, 'pengguna')
      .replace(/customer/gi, 'pelanggan')
      .replace(/product/gi, 'produk')
      .replace(/service/gi, 'layanan')
      .replace(/website/gi, 'situs web')
      .replace(/application/gi, 'aplikasi')
      .replace(/features/gi, 'fitur')
      .replace(/benefits/gi, 'manfaat')
      .replace(/minutes/gi, 'menit')
      .replace(/words/gi, 'kata');
  }
  
  return text;
}
