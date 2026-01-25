ALTER TABLE t_p33228717_sparcom_landing_page.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

ALTER TABLE t_p33228717_sparcom_landing_page.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_user_role_check;

UPDATE t_p33228717_sparcom_landing_page.user_profiles 
SET user_role = 'participant' 
WHERE user_role = 'guest';

ALTER TABLE t_p33228717_sparcom_landing_page.user_profiles
ADD CONSTRAINT user_profiles_user_role_check 
CHECK (user_role IN ('participant', 'organizer', 'master', 'bathowner'));

ALTER TABLE t_p33228717_sparcom_landing_page.user_profiles 
ALTER COLUMN user_role SET DEFAULT 'participant';