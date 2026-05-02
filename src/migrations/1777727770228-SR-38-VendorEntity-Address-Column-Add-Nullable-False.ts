import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR38VendorEntityAddressColumnAddNullableFalse1777727770228 implements MigrationInterface {
  name = 'SR38VendorEntityAddressColumnAddNullableFalse1777727770228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."vendor" ALTER COLUMN "address" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."vendor" ALTER COLUMN "address" DROP NOT NULL`,
    );
  }
}
