CREATE TABLE "User" (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    created TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE Channel (
    id UUID PRIMARY KEY,
    name TEXT
);

CREATE TABLE Message (
    id UUID PRIMARY KEY,
    sender UUID NOT NULL, -- foreign key?
    channel UUID NOT NULL, -- foreign key?
    text TEXT,
    media BYTEA,
    media_type TEXT,
    created TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE Channel_User (
    channel UUID NOT NULL, -- foreign key?
    "user" UUID NOT NULL, -- foreign key?
    last_seen UUID
);
