-- Residents do not have employment details.
ALTER TABLE employees ALTER COLUMN department DROP NOT NULL;
ALTER TABLE employees ALTER COLUMN job_title DROP NOT NULL;
ALTER TABLE employees ALTER COLUMN salary DROP NOT NULL;
