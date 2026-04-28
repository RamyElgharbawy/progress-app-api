import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteToTasks1777365047953 implements MigrationInterface {
    name = 'AddCascadeDeleteToTasks1777365047953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_b03c99063a4eaf084f069a4d5a7"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_b03c99063a4eaf084f069a4d5a7" FOREIGN KEY ("parent_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_b03c99063a4eaf084f069a4d5a7"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_b03c99063a4eaf084f069a4d5a7" FOREIGN KEY ("parent_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
