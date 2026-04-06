import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR15AppointmentEntityUseridColumnNameChange1775384069379 implements MigrationInterface {
  name = 'SR15AppointmentEntityUseridColumnNameChange1775384069379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."appointment" RENAME COLUMN "userid" TO "userId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."appointment" RENAME COLUMN "userId" TO "userid"`,
    );
  }
}
