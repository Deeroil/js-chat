CREATE TABLE Account (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE Channel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT
);

CREATE TABLE Message (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender UUID NOT NULL REFERENCES Account (id), 
  channel UUID NOT NULL REFERENCES Channel (id),
  text TEXT,
  media BYTEA,
  media_type TEXT,
  created TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE Channel_Account (
  channel UUID NOT NULL REFERENCES Channel (id),
  account UUID NOT NULL REFERENCES Account (id),
  last_seen UUID REFERENCES Message (id)
);
