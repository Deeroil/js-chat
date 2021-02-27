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
  sender UUID NOT NULL, -- foreign key?
  channel UUID NOT NULL, -- foreign key?
  text TEXT,
  media BYTEA,
  media_type TEXT,
  created TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE Channel_Account (
  channel UUID NOT NULL, -- foreign key?
  account UUID NOT NULL, -- foreign key?
  last_seen UUID -- foreign key?
);
