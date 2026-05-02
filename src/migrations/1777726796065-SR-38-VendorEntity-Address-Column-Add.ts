import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR38VendorEntityAddressColumnAdd1777726796065 implements MigrationInterface {
  name = 'SR38VendorEntityAddressColumnAdd1777726796065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."vendor" ADD "address" character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."vendor" DROP COLUMN "address"`,
    );
  }
}
