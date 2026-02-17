import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1771327591099 implements MigrationInterface {
  name = 'CreateUsersTable1771327591099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "userName" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59" UNIQUE ("userName")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_226bb9aa7aa8a69991209d58f5" ON "users" ("userName") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_226bb9aa7aa8a69991209d58f5"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_226bb9aa7aa8a69991209d58f59"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userName"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    );
  }
}
