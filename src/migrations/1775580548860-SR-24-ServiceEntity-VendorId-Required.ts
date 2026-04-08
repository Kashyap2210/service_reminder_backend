import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR24ServiceEntityVendorIdRequired1775580548860 implements MigrationInterface {
  name = 'SR24ServiceEntityVendorIdRequired1775580548860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" ALTER COLUMN "vendorId" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" ALTER COLUMN "vendorId" DROP NOT NULL`,
    );
  }
}
