import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlanAndTaskTables1775300951911 implements MigrationInterface {
  name = 'CreatePlanAndTaskTables1775300951911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_status_enum" AS ENUM('started', 'in-progress', 'completed', 'postponed', 'not-started')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plan_id" uuid NOT NULL, "parent_id" uuid, "name" character varying(255) NOT NULL, "job_description" text, "area" character varying(100), "department" character varying(100), "duration" integer, "planned_duration" character varying(50), "need_permits" boolean NOT NULL DEFAULT false, "scheduled_start" TIMESTAMP NOT NULL, "scheduled_end" TIMESTAMP NOT NULL, "actual_start" TIMESTAMP, "actual_end" TIMESTAMP, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'not-started', "progress" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."plans_status_enum" AS ENUM('Active', 'Completed', 'Draft')`,
    );
    await queryRunner.query(
      `CREATE TABLE "plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "status" "public"."plans_status_enum" NOT NULL DEFAULT 'Draft', "progress" integer NOT NULL DEFAULT '0', "created_by" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_dependencies_type_enum" AS ENUM('FS', 'SS', 'FF', 'SF')`,
    );
    await queryRunner.query(
      `CREATE TABLE "task_dependencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "task_id" uuid NOT NULL, "depends_on_task_id" uuid NOT NULL, "type" "public"."task_dependencies_type_enum" NOT NULL DEFAULT 'FS', "lag" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e31de0e173af595a21c4ec8e48b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_31a280e3d0a129221e614c63125" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_b03c99063a4eaf084f069a4d5a7" FOREIGN KEY ("parent_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD CONSTRAINT "FK_7c5f6f43e87905766afe5590b56" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_dependencies" ADD CONSTRAINT "FK_1ae6688b1bd90fffe857f4cb707" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_dependencies" ADD CONSTRAINT "FK_26dedda08faccdb95aff99e112e" FOREIGN KEY ("depends_on_task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_dependencies" DROP CONSTRAINT "FK_26dedda08faccdb95aff99e112e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_dependencies" DROP CONSTRAINT "FK_1ae6688b1bd90fffe857f4cb707"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" DROP CONSTRAINT "FK_7c5f6f43e87905766afe5590b56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_b03c99063a4eaf084f069a4d5a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_31a280e3d0a129221e614c63125"`,
    );
    await queryRunner.query(`DROP TABLE "task_dependencies"`);
    await queryRunner.query(`DROP TYPE "public"."task_dependencies_type_enum"`);
    await queryRunner.query(`DROP TABLE "plans"`);
    await queryRunner.query(`DROP TYPE "public"."plans_status_enum"`);
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
  }
}
