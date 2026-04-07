import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR18ServiceEntityColumnNamesChange1775550989308 implements MigrationInterface {
  name = 'SR18ServiceEntityColumnNamesChange1775550989308';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" RENAME COLUMN "recurringItemid" TO "recurringItemId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" RENAME COLUMN "userid" TO "userId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" RENAME COLUMN "userId" TO "userid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."service" RENAME COLUMN "recurringItemId" TO "recurringItemid"`,
    );
  }
}
