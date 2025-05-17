
-- This file is for reference only, not used in the codebase directly
-- It will be applied through a SQL migration

CREATE OR REPLACE FUNCTION public.delete_submission_and_update_xp(submission_id uuid, xp_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify the submission belongs to the current user
  IF NOT EXISTS (
    SELECT 1 FROM public.submissions 
    WHERE id = submission_id 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Submission not found or not owned by current user';
  END IF;
  
  -- Update the user's XP
  UPDATE public.profiles 
  SET current_xp = GREATEST(current_xp - xp_amount, 0)
  WHERE id = auth.uid();
  
  -- Delete the submission
  DELETE FROM public.submissions 
  WHERE id = submission_id 
  AND user_id = auth.uid();
END;
$$;
