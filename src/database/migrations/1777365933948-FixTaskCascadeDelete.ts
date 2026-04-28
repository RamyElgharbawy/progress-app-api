// src/database/migrations/xxxxxxxx-FixTaskCascadeDelete.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTaskCascadeDelete1777365933948 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, get the actual constraint name from your database
    const result = await queryRunner.query(`
            SELECT conname 
            FROM pg_constraint 
            WHERE conrelid = 'tasks'::regclass 
            AND confrelid = 'tasks'::regclass
            AND contype = 'f'
        `);

    const constraintName =
      result[0]?.conname || 'FK_b03c99063a4eaf084f069a4d5a7';

    // Drop the existing foreign key constraint
    await queryRunner.query(`
            ALTER TABLE "tasks" 
            DROP CONSTRAINT IF EXISTS "${constraintName}"
        `);

    // Re-add the foreign key with CASCADE DELETE
    await queryRunner.query(`
            ALTER TABLE "tasks" 
            ADD CONSTRAINT "${constraintName}" 
            FOREIGN KEY ("parent_id") 
            REFERENCES "tasks"("id") 
            ON DELETE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const result = await queryRunner.query(`
            SELECT conname 
            FROM pg_constraint 
            WHERE conrelid = 'tasks'::regclass 
            AND confrelid = 'tasks'::regclass
            AND contype = 'f'
        `);

    const constraintName =
      result[0]?.conname || 'FK_b03c99063a4eaf084f069a4d5a7';

    await queryRunner.query(`
            ALTER TABLE "tasks" 
            DROP CONSTRAINT "${constraintName}"
        `);

    await queryRunner.query(`
            ALTER TABLE "tasks" 
            ADD CONSTRAINT "${constraintName}" 
            FOREIGN KEY ("parent_id") 
            REFERENCES "tasks"("id")
        `);
  }
}
