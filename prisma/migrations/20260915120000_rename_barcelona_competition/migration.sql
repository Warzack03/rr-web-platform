-- Keep the Catalunya competition naming consistent with the public team name.
-- The predicates cover the previous labels and make the data update safe to run
-- against databases that already contain the final name.
UPDATE `competitions`
SET
    `name` = 'Liga Barcelona',
    `slug` = 'liga-barcelona'
WHERE `slug` IN ('liga-f7-barcelona', 'liga-de-barcelona')
   OR `name` IN ('Liga F7 Barcelona', 'Liga de Barcelona');
