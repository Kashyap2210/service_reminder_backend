import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR24AppointmentVendorIdMandatory1775578615887 implements MigrationInterface {
  name = 'SR24AppointmentVendorIdMandatory1775578615887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."appointment" ALTER COLUMN "vendorId" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."appointment" ALTER COLUMN "vendorId" DROP NOT NULL`,
    );
  }
}
