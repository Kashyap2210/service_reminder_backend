import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR15VendorEntityRemoveRecurringItemId1775387342701 implements MigrationInterface {
  name = 'SR15VendorEntityRemoveRecurringItemId1775387342701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."vendor" DROP COLUMN "recurringItemId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."vendor" ADD "recurringItemId" integer NOT NULL`,
    );
  }
}
