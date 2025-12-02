-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Canvases Table
CREATE TABLE IF NOT EXISTS canvases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'Untitled Canvas',
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Threads Table (Cards & Zones)
CREATE TABLE IF NOT EXISTS threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canvas_id UUID REFERENCES canvases(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('card', 'zone')),
    x FLOAT NOT NULL DEFAULT 0,
    y FLOAT NOT NULL DEFAULT 0,
    width FLOAT,
    height FLOAT,
    title TEXT,
    content TEXT,
    author_id UUID REFERENCES auth.users(id),
    sentiment TEXT CHECK (sentiment IN ('bullish', 'bearish', 'neutral', 'volatile')),
    locked BOOLEAN DEFAULT FALSE,
    z_index INT DEFAULT 0,
    color TEXT,
    image_url TEXT,
    tags TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connections Table (Graph Edges)
CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canvas_id UUID REFERENCES canvases(id) ON DELETE CASCADE,
    source_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    target_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    label TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_id, target_id)
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reactions Table
CREATE TABLE IF NOT EXISTS reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies (Public/Auth for Prototype)
-- Allow anyone to read
CREATE POLICY "Public read access" ON canvases FOR SELECT USING (true);
CREATE POLICY "Public read access" ON threads FOR SELECT USING (true);
CREATE POLICY "Public read access" ON connections FOR SELECT USING (true);
CREATE POLICY "Public read access" ON comments FOR SELECT USING (true);
CREATE POLICY "Public read access" ON reactions FOR SELECT USING (true);

-- Allow authenticated to insert/update/delete (Simplified for prototype)
CREATE POLICY "Auth write access" ON canvases FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write access" ON threads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write access" ON connections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write access" ON comments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write access" ON reactions FOR ALL USING (auth.role() = 'authenticated');

-- Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE threads, connections, comments, reactions;
