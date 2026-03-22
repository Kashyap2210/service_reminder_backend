import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR3NotificationEntity1774200493769 implements MigrationInterface {
  name = 'SR3NotificationEntity1774200493769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "service_reminder"."notification_type_enum" AS ENUM('EMAIL_APPOINTMENT_REMINDER', 'EMAIL_SERVICE_REMINDER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "service_reminder"."notification_status_enum" AS ENUM('PENDING', 'SENT', 'FAILED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_reminder"."notification" (
      "id" SERIAL NOT NULL, 
      "userid" integer NOT NULL, 
      "recurringItemid" integer NOT NULL, 
      "appointmentId" integer, 
      "type" "service_reminder"."notification_type_enum" NOT NULL, 
      "status" "service_reminder"."notification_status_enum" NOT NULL DEFAULT 'PENDING', 
      "scheduledFor" bigint NOT NULL, 
      "sentAt" bigint, 
      "retryCount" integer NOT NULL DEFAULT '0', 
      "lastError" character varying, 
      "payload" jsonb NOT NULL, 
      "createdOn" bigint NOT NULL, 
      "updatedOn" bigint NOT NULL, 
      "createdBy" integer, 
      "updatedBy" integer, 
      CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service_reminder"."notification"`);
    await queryRunner.query(
      `DROP TYPE "service_reminder"."notification_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "service_reminder"."notification_type_enum"`,
    );
  }
}
