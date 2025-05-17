
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { challengeId, submission } = await req.json();
    
    // Validate input
    if (!challengeId || !submission) {
      return new Response(JSON.stringify({ 
        error: 'Missing required parameters: challengeId and submission are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Get challenge details
    const { data: challenge, error: challengeError } = await supabaseClient
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();
    
    if (challengeError || !challenge) {
      return new Response(JSON.stringify({ error: 'Challenge not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Call OpenAI to score the submission
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const scoringPrompt = `
    You are an expert copywriting teacher evaluating a student's submission.
    
    CHALLENGE:
    Type: ${challenge.type}
    Title: ${challenge.title}
    Brief: ${challenge.brief}
    Guidelines:
    ${challenge.guidelines.map(g => `- ${g}`).join('\n')}
    
    STUDENT SUBMISSION:
    "${submission}"
    
    Evaluate the submission based on:
    1. How well it meets the brief
    2. Adherence to guidelines
    3. Writing quality and effectiveness
    
    Provide:
    1. A numerical score from 1-100
    2. 3-4 specific points of feedback (what was done well)
    3. One specific improvement suggestion
    4. XP to award (between 50-200, based on quality and difficulty)
    
    Respond with ONLY a valid JSON object with:
    {
      "score": [number],
      "feedback": [array of strings],
      "improvement": [string],
      "xp_gained": [number]
    }`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that evaluates writing submissions. Return ONLY valid JSON without any markdown formatting, code blocks, or additional text.' },
          { role: 'user', content: scoringPrompt }
        ],
        temperature: 0.3,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return new Response(JSON.stringify({ error: 'Failed to score submission' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const openaiData = await response.json();
    let scoring;
    
    try {
      // Extract and parse the JSON from the response, handling possible markdown formatting
      const responseText = openaiData.choices[0].message.content;
      
      // Clean up the response if it contains markdown code blocks or other formatting
      const jsonContent = responseText.replace(/```json|```|<\/?[^>]+(>|$)/g, '').trim();
      
      console.log("Cleaned JSON response:", jsonContent);
      scoring = JSON.parse(jsonContent);
      
      // Validate the expected structure
      if (!scoring.score || !Array.isArray(scoring.feedback) || !scoring.improvement || !scoring.xp_gained) {
        throw new Error("Response missing required fields");
      }
      
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      console.error('Raw response:', openaiData.choices[0].message.content);
      return new Response(JSON.stringify({ error: 'Failed to parse scoring response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Save submission
    const { data: submissionData, error: submissionError } = await supabaseClient
      .from('submissions')
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        response: submission,
        score: scoring.score,
        feedback: scoring.feedback,
        improvement_tip: scoring.improvement,
        xp_gained: scoring.xp_gained
      })
      .select();
    
    if (submissionError) {
      console.error("Error saving submission:", submissionError);
      return new Response(JSON.stringify({ error: 'Failed to save submission' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Update user XP and level
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('current_xp, level_id')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      // Don't fail the whole request, just log the error
    }
    
    if (profileData) {
      const newXp = profileData.current_xp + scoring.xp_gained;
      
      // Get next level requirements
      const { data: levels, error: levelsError } = await supabaseClient
        .from('levels')
        .select('id, required_xp')
        .order('required_xp', { ascending: true });
      
      if (levelsError) {
        console.error("Error fetching levels:", levelsError);
      }
      
      let newLevelId = profileData.level_id;
      
      // Check if user should level up
      if (levels) {
        for (const level of levels) {
          if (newXp >= level.required_xp && level.id > newLevelId) {
            newLevelId = level.id;
          }
        }
      }
      
      // Update profile
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({
          current_xp: newXp,
          level_id: newLevelId
        })
        .eq('id', user.id);
        
      if (updateError) {
        console.error("Error updating profile:", updateError);
      }
    }
    
    // Update challenge status
    const { error: statusError } = await supabaseClient
      .from('user_challenges')
      .update({ status: 'completed' })
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId);
      
    if (statusError) {
      console.error("Error updating challenge status:", statusError);
    }
    
    return new Response(JSON.stringify({
      success: true,
      result: scoring,
      submission_id: submissionData?.[0]?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in score-submission function:', error);
    return new Response(JSON.stringify({ error: error.message || 'An unknown error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
