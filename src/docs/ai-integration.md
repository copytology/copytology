
# AI Integration Plan

## Challenge Generation

We'll use Supabase Edge Functions to interact with the OpenAI API for generating challenges.

### Edge Function: generate-challenges

```typescript
// supabase/functions/generate-challenges/index.ts
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
    
    const { data: userProfile } = await supabaseClient
      .from('profiles')
      .select('level_id')
      .eq('id', user.id)
      .single();
    
    const level_id = userProfile?.level_id || 1;

    // Get challenge types and difficulties based on user level
    const challengeTypes = ['copywriting', 'content', 'uxwriting'];
    
    let difficulties;
    if (level_id <= 2) {
      difficulties = ['Easy', 'Medium'];
    } else if (level_id <= 5) {
      difficulties = ['Easy', 'Medium', 'Hard'];
    } else {
      difficulties = ['Medium', 'Hard'];
    }
    
    // Call OpenAI to generate challenges
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    const challengePrompt = `Generate 10 unique writing challenges for a copywriting learning app. 
    User is at level: ${level_id} (1-10 scale where 10 is expert).
    
    For each challenge, provide:
    1. Type (choose from: ${challengeTypes.join(', ')})
    2. Title (short, catchy)
    3. Description (1-2 sentences explaining the skill)
    4. Brief (the specific task for the user)
    5. Difficulty (choose from: ${difficulties.join(', ')})
    6. Time estimate (e.g., "10 min")
    7. Guidelines (3-4 bullet points of advice)
    8. Word limit (appropriate for the task)
    9. Example prompt (a hint that might help the user)
    
    Format the response as a valid JSON array of challenge objects.`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates writing challenges.' },
          { role: 'user', content: challengePrompt }
        ],
        temperature: 0.7,
      }),
    });
    
    const openaiData = await response.json();
    let challenges;
    
    try {
      // Extract and parse the JSON from the response
      const responseText = openaiData.choices[0].message.content;
      challenges = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      return new Response(JSON.stringify({ error: 'Failed to parse challenges' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Insert challenges into the database
    for (const challenge of challenges) {
      const { data, error } = await supabaseClient
        .from('challenges')
        .insert({
          type: challenge.type.toLowerCase(),
          title: challenge.title,
          description: challenge.description,
          brief: challenge.brief,
          difficulty: challenge.difficulty,
          time_estimate: challenge.time_estimate,
          guidelines: challenge.guidelines,
          word_limit: challenge.word_limit,
          example_prompt: challenge.example_prompt,
          min_level_id: level_id,
        })
        .select();
      
      if (data && data[0]) {
        // Assign challenge to user
        await supabaseClient
          .from('user_challenges')
          .insert({
            user_id: user.id,
            challenge_id: data[0].id,
            status: 'active',
          });
      }
    }
    
    return new Response(JSON.stringify({ success: true, count: challenges.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-challenges function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

## Submission Scoring

### Edge Function: score-submission

```typescript
// supabase/functions/score-submission/index.ts
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
    
    Format your response as a JSON object with:
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
          { role: 'system', content: 'You are a helpful assistant that evaluates writing submissions.' },
          { role: 'user', content: scoringPrompt }
        ],
        temperature: 0.3,
      }),
    });
    
    const openaiData = await response.json();
    let scoring;
    
    try {
      // Extract and parse the JSON from the response
      const responseText = openaiData.choices[0].message.content;
      scoring = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      return new Response(JSON.stringify({ error: 'Failed to parse scoring' }), {
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
      return new Response(JSON.stringify({ error: 'Failed to save submission' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Update user XP and level
    const { data: profileData } = await supabaseClient
      .from('profiles')
      .select('current_xp, level_id')
      .eq('id', user.id)
      .single();
    
    if (profileData) {
      const newXp = profileData.current_xp + scoring.xp_gained;
      
      // Get next level requirements
      const { data: levels } = await supabaseClient
        .from('levels')
        .select('id, required_xp')
        .order('required_xp', { ascending: true });
      
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
      await supabaseClient
        .from('profiles')
        .update({
          current_xp: newXp,
          level_id: newLevelId
        })
        .eq('id', user.id);
    }
    
    // Update challenge status
    await supabaseClient
      .from('user_challenges')
      .update({ status: 'completed' })
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId);
    
    return new Response(JSON.stringify({
      success: true,
      result: scoring,
      submission_id: submissionData[0].id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in score-submission function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```
