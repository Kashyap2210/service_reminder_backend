import { MigrationInterface, QueryRunner } from "typeorm";

export class SR42NotificationEntityExhaustedStatusAdd1777982504650 implements MigrationInterface {
    name = 'SR42NotificationEntityExhaustedStatusAdd1777982504650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "service_reminder"."cron_job_status_enum" AS ENUM('SCHEDULED', 'RUNNING', 'COMPLETED', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "service_reminder"."cron_job" ("createdOn" bigint NOT NULL, "updatedOn" bigint NOT NULL, "createdBy" integer, "updatedBy" integer, "id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "cronExpression" character varying(50) NOT NULL, "scheduledAt" bigint NOT NULL, "startedAt" bigint, "completedAt" bigint, "status" "service_reminder"."cron_job_status_enum" NOT NULL DEFAULT 'SCHEDULED', "error" jsonb, CONSTRAINT "PK_3f180d097e1216411578b642513" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "service_reminder"."notification_status_enum" RENAME TO "notification_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "service_reminder"."notification_status_enum" AS ENUM('PENDING', 'SENT', 'FAILED', 'CANCELLED', 'EXHAUSTED')`);
        await queryRunner.query(`ALTER TABLE "service_reminder"."notification" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "service_reminder"."notification" ALTER COLUMN "status" TYPE "service_reminder"."notification_status_enum" USING "status"::"text"::"service_reminder"."notification_status_enum"`);
        await queryRunner.query(`ALTER TABLE "service_reminder"."notification" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "service_reminder"."notification_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "service_reminder"."notification_status_enum_old" AS ENUM('PENDING', 'SENT', 'FAILED', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "service_reminder"."notification" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "service_reminder"."notification" ALTER COLUMN "status" TYPE "service_reminder"."notification_status_enum_old" USING "status"::"text"::"service_reminder"."notification_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "service_reminder"."notification" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "service_reminder"."notification_status_enum"`);
        await queryRunner.query(`ALTER TYPE "service_reminder"."notification_status_enum_old" RENAME TO "notification_status_enum"`);
        await queryRunner.query(`DROP TABLE "service_reminder"."cron_job"`);
        await queryRunner.query(`DROP TYPE "service_reminder"."cron_job_status_enum"`);
    }

}
