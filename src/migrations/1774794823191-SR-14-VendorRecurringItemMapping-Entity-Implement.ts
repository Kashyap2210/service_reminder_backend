import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR14VendorRecurringItemMappingEntityImplement1774794823191 implements MigrationInterface {
  name = 'SR14VendorRecurringItemMappingEntityImplement1774794823191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "service_reminder"."vendor_recurring_item_mapping" ("createdOn" bigint NOT NULL, "updatedOn" bigint NOT NULL, "createdBy" integer, "updatedBy" integer, "id" SERIAL NOT NULL, "vendorId" integer NOT NULL, "recurringItemId" integer NOT NULL, CONSTRAINT "PK_10d85008f785453d7181809e8fd" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "service_reminder"."vendor_recurring_item_mapping"`,
    );
  }
}
