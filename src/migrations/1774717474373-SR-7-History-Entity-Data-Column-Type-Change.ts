import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR7HistoryEntityDataColumnTypeChange1774717474373 implements MigrationInterface {
  name = 'SR7HistoryEntityDataColumnTypeChange1774717474373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'vendor_history',
      'service_history',
      'recurring_item_history',
      'appointment_history',
      'user_history',
    ];

    for (const table of tables) {
      await queryRunner.query(
        `ALTER TABLE "service_reminder"."${table}" ALTER COLUMN "data" TYPE character varying(1024)`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'vendor_history',
      'service_history',
      'recurring_item_history',
      'appointment_history',
      'user_history',
    ];

    for (const table of tables) {
      await queryRunner.query(
        `ALTER TABLE "service_reminder"."${table}" ALTER COLUMN "data" TYPE text`,
      );
    }
  }
}
