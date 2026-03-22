import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR3CronjobEntity1774200198387 implements MigrationInterface {
  name = 'SR3CronjobEntity1774200198387';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "service_reminder"."cronjob_status_enum" AS ENUM('SCHEDULED', 'RUNNING', 'COMPLETED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_reminder"."cronjob" (
      "id" SERIAL NOT NULL, 
      "name" character varying(100) NOT NULL, 
      "cronExpression" character varying(50) NOT NULL, 
      "scheduledAt" bigint NOT NULL, 
      "startedAt" bigint, 
      "completedAt" bigint, 
      "status" "service_reminder"."cronjob_status_enum" NOT NULL DEFAULT 'SCHEDULED', 
      "error" jsonb, 
      "createdOn" bigint NOT NULL, 
      "updatedOn" bigint NOT NULL, 
      "createdBy" integer, 
      "updatedBy" integer, 
      CONSTRAINT "PK_743ffd6c2eb7ed6ef66199d6dec" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service_reminder"."cronjob"`);
    await queryRunner.query(
      `DROP TYPE "service_reminder"."cronjob_status_enum"`,
    );
  }
}
