import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from "node:fs";
import * as path from "node:path";

export class CreateTables1234567890000 implements MigrationInterface {
    name = 'CreateTables1234567890000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "resource" varchar CHECK( "resource" IN ('user','profile','contact','role','permission','admin','auth','*') ) NOT NULL DEFAULT ('auth'), "action" varchar CHECK( "action" IN ('create','read','update','delete','*') ) NOT NULL DEFAULT ('read'), "description" varchar, CONSTRAINT "UQ_7331684c0c5b063803a425001a0" UNIQUE ("resource", "action"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar CHECK( "name" IN ('admin','user','editor','viewer','super user') ) NOT NULL, "description" varchar, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "roles_permissions" ("rolesId" integer NOT NULL, "permissionsId" integer NOT NULL, PRIMARY KEY ("rolesId", "permissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bf98d8fd47610db71dfc5a4a5f" ON "roles_permissions" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f25fd350775094ceb3a02c1468" ON "roles_permissions" ("permissionsId") `);
        await queryRunner.query(`CREATE TABLE "users_roles" ("userId" integer NOT NULL, "rolesId" integer NOT NULL, PRIMARY KEY ("userId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_776b7cf9330802e5ef5a8fb18d" ON "users_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_21db462422f1f97519a29041da" ON "users_roles" ("rolesId") `);
        await queryRunner.query(`DROP INDEX "IDX_bf98d8fd47610db71dfc5a4a5f"`);
        await queryRunner.query(`DROP INDEX "IDX_f25fd350775094ceb3a02c1468"`);
        await queryRunner.query(`CREATE TABLE "temporary_roles_permissions" ("rolesId" integer NOT NULL, "permissionsId" integer NOT NULL, CONSTRAINT "FK_bf98d8fd47610db71dfc5a4a5ff" FOREIGN KEY ("rolesId") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_f25fd350775094ceb3a02c14681" FOREIGN KEY ("permissionsId") REFERENCES "permissions" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("rolesId", "permissionsId"))`);
        await queryRunner.query(`INSERT INTO "temporary_roles_permissions"("rolesId", "permissionsId") SELECT "rolesId", "permissionsId" FROM "roles_permissions"`);
        await queryRunner.query(`DROP TABLE "roles_permissions"`);
        await queryRunner.query(`ALTER TABLE "temporary_roles_permissions" RENAME TO "roles_permissions"`);
        await queryRunner.query(`CREATE INDEX "IDX_bf98d8fd47610db71dfc5a4a5f" ON "roles_permissions" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f25fd350775094ceb3a02c1468" ON "roles_permissions" ("permissionsId") `);
        await queryRunner.query(`DROP INDEX "IDX_776b7cf9330802e5ef5a8fb18d"`);
        await queryRunner.query(`DROP INDEX "IDX_21db462422f1f97519a29041da"`);
        await queryRunner.query(`CREATE TABLE "temporary_users_roles" ("userId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "FK_776b7cf9330802e5ef5a8fb18dc" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_21db462422f1f97519a29041da0" FOREIGN KEY ("rolesId") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "rolesId"))`);
        await queryRunner.query(`INSERT INTO "temporary_users_roles"("userId", "rolesId") SELECT "userId", "rolesId" FROM "users_roles"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`ALTER TABLE "temporary_users_roles" RENAME TO "users_roles"`);
        await queryRunner.query(`CREATE INDEX "IDX_776b7cf9330802e5ef5a8fb18d" ON "users_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_21db462422f1f97519a29041da" ON "users_roles" ("rolesId") `);

        //     // Path to your 'UP' script in the dist folder
        //         console.log("__dirname in migration is:", __dirname);
        // // Inside your migration .ts file
        //         const sql = fs.readFileSync(
        //             path.join(__dirname, '..', 'sql', 'permissions', 'insert_permissions.up.sql'), 
        //             'utf8'
        //         );
        
        //         console.log("Executing SQL for seeding permissions...");
        //         const statements = sql.split(';').filter(s => s.trim() !== '');
        //         console.log("SQL Statements to execute:", statements);
        //         for (const statement of statements) {
        //             console.log("Executing statement:", statement);
        //             await queryRunner.query(statement);
        //         }
        //         console.log("Permissions seeded successfully.");


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_21db462422f1f97519a29041da"`);
        await queryRunner.query(`DROP INDEX "IDX_776b7cf9330802e5ef5a8fb18d"`);
        await queryRunner.query(`ALTER TABLE "users_roles" RENAME TO "temporary_users_roles"`);
        await queryRunner.query(`CREATE TABLE "users_roles" ("userId" integer NOT NULL, "rolesId" integer NOT NULL, PRIMARY KEY ("userId", "rolesId"))`);
        await queryRunner.query(`INSERT INTO "users_roles"("userId", "rolesId") SELECT "userId", "rolesId" FROM "temporary_users_roles"`);
        await queryRunner.query(`DROP TABLE "temporary_users_roles"`);
        await queryRunner.query(`CREATE INDEX "IDX_21db462422f1f97519a29041da" ON "users_roles" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_776b7cf9330802e5ef5a8fb18d" ON "users_roles" ("userId") `);
        await queryRunner.query(`DROP INDEX "IDX_f25fd350775094ceb3a02c1468"`);
        await queryRunner.query(`DROP INDEX "IDX_bf98d8fd47610db71dfc5a4a5f"`);
        await queryRunner.query(`ALTER TABLE "roles_permissions" RENAME TO "temporary_roles_permissions"`);
        await queryRunner.query(`CREATE TABLE "roles_permissions" ("rolesId" integer NOT NULL, "permissionsId" integer NOT NULL, PRIMARY KEY ("rolesId", "permissionsId"))`);
        await queryRunner.query(`INSERT INTO "roles_permissions"("rolesId", "permissionsId") SELECT "rolesId", "permissionsId" FROM "temporary_roles_permissions"`);
        await queryRunner.query(`DROP TABLE "temporary_roles_permissions"`);
        await queryRunner.query(`CREATE INDEX "IDX_f25fd350775094ceb3a02c1468" ON "roles_permissions" ("permissionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bf98d8fd47610db71dfc5a4a5f" ON "roles_permissions" ("rolesId") `);
        await queryRunner.query(`DROP INDEX "IDX_21db462422f1f97519a29041da"`);
        await queryRunner.query(`DROP INDEX "IDX_776b7cf9330802e5ef5a8fb18d"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`DROP INDEX "IDX_f25fd350775094ceb3a02c1468"`);
        await queryRunner.query(`DROP INDEX "IDX_bf98d8fd47610db71dfc5a4a5f"`);
        await queryRunner.query(`DROP TABLE "roles_permissions"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
