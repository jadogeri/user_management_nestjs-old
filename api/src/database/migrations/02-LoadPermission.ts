import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from "node:fs";
import * as path from "node:path";

export class SeedRoles1234567890001 implements MigrationInterface {
    name = 'SeedRoles1234567890001'
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Path to your 'UP' script in the dist folder
                console.log("__dirname in migration is:", __dirname);
        // Inside your migration .ts file
                const sql = fs.readFileSync(
                    path.join(__dirname, '..', 'sql', 'permissions', 'insert_permissions.up.sql'), 
                    'utf8'
                );
        
                console.log("Executing SQL for seeding permissions...");
                const statements = sql.split(';').filter(s => s.trim() !== '');
                console.log("SQL Statements to execute:", statements);
                for (const statement of statements) {
                    console.log("Executing statement:", statement);
                    await queryRunner.query(statement);
                }
                console.log("Permissions seeded successfully.");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Path to your 'DOWN' script in the dist folder
        const sql = fs.readFileSync(
            path.join(__dirname, '../sql/roles/drop-roles.down.sql'), 
            'utf8'
        );
        await queryRunner.query(sql);
    }
}
