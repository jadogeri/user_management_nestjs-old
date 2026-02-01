INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'user', 'create', 'Allows creating new users'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'user' AND "action" = 'create'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'user', 'read', 'Allows viewing user details'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'user' AND "action" = 'read'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'user', 'update', 'Allows editing user info'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'user' AND "action" = 'update'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'user', 'delete', 'Allows removing users'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'user' AND "action" = 'delete'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'role', 'create', 'Allows creating roles'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'role' AND "action" = 'create'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'role', 'read', 'Allows viewing roles'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'role' AND "action" = 'read'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT 'role', 'update', 'Allows editing roles'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = 'role' AND "action" = 'update'
);

INSERT INTO "permissions" ("resource", "action", "description")
SELECT '*', '*', 'Full system access'
WHERE NOT EXISTS (
    SELECT 1 FROM "permissions" WHERE "resource" = '*' AND "action" = '*'
);
