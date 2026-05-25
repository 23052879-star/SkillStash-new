/*
  # Add users insert policy

  1. Security Changes
    - Add RLS policy to allow users to insert their own data during signup
    - Policy ensures users can only insert rows where their auth.uid matches the row id

  Note: Existing policies for SELECT and UPDATE are maintained
*/

CREATE POLICY "Users can insert their own data"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);