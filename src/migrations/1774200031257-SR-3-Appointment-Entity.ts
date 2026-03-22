import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR3AppointmentEntity1774200031257 implements MigrationInterface {
  name = 'SR3AppointmentEntity1774200031257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "service_reminder"."appointment_appointmenttype_enum" AS ENUM('SERVICE', 'RUNNING REPAIR', 'GENERAL CHECK UP', 'REPEAT_REPAIR')`,
    );
    await queryRunner.query(
      `CREATE TYPE "service_reminder"."appointment_appointmentstatus_enum" AS ENUM('BOOKED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_reminder"."appointment" (
        "id" SERIAL NOT NULL, 
        "appointmentDate" bigint NOT NULL, 
        "recurringItemId" integer NOT NULL, 
        "userid" integer NOT NULL, 
        "appointmentType" "service_reminder"."appointment_appointmenttype_enum" NOT NULL, 
        "vendorId" integer, 
        "appointmentStatus" "service_reminder"."appointment_appointmentstatus_enum" NOT NULL DEFAULT 'BOOKED', 
        "checkPoints" character varying(1024), 
        "createdOn" bigint NOT NULL, 
        "updatedOn" bigint NOT NULL, 
        "createdBy" integer, 
        "updatedBy" integer, 
      CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service_reminder"."appointment"`);
    await queryRunner.query(
      `DROP TYPE "service_reminder"."appointment_appointmentstatus_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "service_reminder"."appointment_appointmenttype_enum"`,
    );
  }
}
