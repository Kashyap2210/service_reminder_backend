import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR38RecurringItemEntityServiceAddressColunDrop1777727708835 implements MigrationInterface {
  name = 'SR38RecurringItemEntityServiceAddressColunDrop1777727708835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."recurring_item" DROP COLUMN "servicePlaceAddress"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."recurring_item" ADD "servicePlaceAddress" character varying(255)`,
    );
  }
}
