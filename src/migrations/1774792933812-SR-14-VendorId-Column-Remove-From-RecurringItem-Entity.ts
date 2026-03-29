import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR14VendorIdColumnRemoveFromRecurringItemEntity1774792933812 implements MigrationInterface {
  name = 'SR14VendorIdColumnRemoveFromRecurringItemEntity1774792933812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."recurring_item" DROP COLUMN "vendorId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."recurring_item" ADD "vendorId" integer`,
    );
  }
}
