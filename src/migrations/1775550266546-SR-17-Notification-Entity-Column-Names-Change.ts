import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR17NotificationEntityColumnNamesChange1775550266546 implements MigrationInterface {
  name = 'SR17NotificationEntityColumnNamesChange1775550266546';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."notification" RENAME COLUMN "userid" TO "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."notification" RENAME COLUMN "recurringItemid" TO "recurringItemId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."notification" RENAME COLUMN "userId" TO "userid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."notification" RENAME COLUMN "recurringItemId" TO "recurringItemid"`,
    );
  }
}
