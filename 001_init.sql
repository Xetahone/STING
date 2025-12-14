-- PostgreSQL schema (simplified)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  subscription TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  avatar_url TEXT,
  bio TEXT,
  stalker_count INT DEFAULT 0,
  stalking_count INT DEFAULT 0
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  caption TEXT,
  media_type TEXT,
  media_key TEXT,
  sound_id UUID,
  allow_reshare BOOLEAN DEFAULT true,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  type TEXT,
  s3_key TEXT,
  duration_seconds INT,
  width INT,
  height INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE voice_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  author_id UUID REFERENCES users(id),
  s3_key TEXT,
  duration_seconds INT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stalker_id UUID REFERENCES users(id),
  stalking_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);