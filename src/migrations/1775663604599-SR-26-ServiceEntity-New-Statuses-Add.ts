import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR26ServiceEntityNewStatusesAdd1775663604599 implements MigrationInterface {
  name = 'SR26ServiceEntityNewStatusesAdd1775663604599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "service_reminder"."service_servicestatus_enum" RENAME TO "service_servicestatus_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "service_reminder"."service_servicestatus_enum" AS ENUM('SCHEDULED', 'SERVICE_STARTED', 'COMPLETED', 'CANCELLED', 'FAILED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" ALTER COLUMN "serviceStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" ALTER COLUMN "serviceStatus" TYPE "service_reminder"."service_servicestatus_enum" USING "serviceStatus"::"text"::"service_reminder"."service_servicestatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" ALTER COLUMN "serviceStatus" SET DEFAULT 'SERVICE_STARTED'`,
    );
    await queryRunner.query(
      `DROP TYPE "service_reminder"."service_servicestatus_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "service_reminder"."service_servicestatus_enum_old" AS ENUM('SERVICE_COMMENCED', 'COMPLETED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" ALTER COLUMN "serviceStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" ALTER COLUMN "serviceStatus" TYPE "service_reminder"."service_servicestatus_enum_old" USING "serviceStatus"::"text"::"service_reminder"."service_servicestatus_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" ALTER COLUMN "serviceStatus" SET DEFAULT 'SERVICE_COMMENCED'`,
    );
    await queryRunner.query(
      `DROP TYPE "service_reminder"."service_servicestatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "service_reminder"."service_servicestatus_enum_old" RENAME TO "service_servicestatus_enum"`,
    );
  }
}
