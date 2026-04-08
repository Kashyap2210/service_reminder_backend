import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR22AppointmentEntityNewStatusesAdd1775662718288 implements MigrationInterface {
  name = 'SR22AppointmentEntityNewStatusesAdd1775662718288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "service_reminder"."appointment_appointmentstatus_enum" RENAME TO "appointment_appointmentstatus_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "service_reminder"."appointment_appointmentstatus_enum" AS ENUM('BOOKED', 'CANCELLED', 'RE_SCHEDULED', 'COMPLETED', 'NO_SHOW')`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."appointment" ALTER COLUMN "appointmentStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."appointment" ALTER COLUMN "appointmentStatus" TYPE "service_reminder"."appointment_appointmentstatus_enum" USING "appointmentStatus"::"text"::"service_reminder"."appointment_appointmentstatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."appointment" ALTER COLUMN "appointmentStatus" SET DEFAULT 'BOOKED'`,
    );
    await queryRunner.query(
      `DROP TYPE "service_reminder"."appointment_appointmentstatus_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "service_reminder"."appointment_appointmentstatus_enum_old" AS ENUM('BOOKED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."appointment" ALTER COLUMN "appointmentStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."appointment" ALTER COLUMN "appointmentStatus" TYPE "service_reminder"."appointment_appointmentstatus_enum_old" USING "appointmentStatus"::"text"::"service_reminder"."appointment_appointmentstatus_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."appointment" ALTER COLUMN "appointmentStatus" SET DEFAULT 'BOOKED'`,
    );
    await queryRunner.query(
      `DROP TYPE "service_reminder"."appointment_appointmentstatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "service_reminder"."appointment_appointmentstatus_enum_old" RENAME TO "appointment_appointmentstatus_enum"`,
    );
  }
}
