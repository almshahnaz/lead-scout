CREATE TABLE IF NOT EXISTS users(
    id uuid PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batch_runs(
    id uuid PRIMARY KEY,
    status text CHECK (status IN('pending', 'done')) NOT NULL,
    user_id uuid REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS company_results(
    id uuid PRIMARY KEY,
    batch_run_id uuid REFERENCES batch_runs(id),
    company_name text NOT NULL,
    status text CHECK (status IN ('done', 'pending', 'failed')) NOT NULL,
    brief text,
    email_draft text
);

