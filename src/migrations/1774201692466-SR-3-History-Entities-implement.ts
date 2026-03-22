import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR3HistoryEntitiesImplement1774201692466 implements MigrationInterface {
  name = 'SR3HistoryEntitiesImplement1774201692466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── Shared history operation enum ────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "service_reminder"."history_operation_enum"
        AS ENUM('CREATE', 'UPDATE', 'DELETE')
    `);

    // ─── vendor_history ───────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "service_reminder"."vendor_history" (
        "id"          SERIAL                                          NOT NULL,
        "entityId"    integer                                         NOT NULL,
        "data"        text                                            NOT NULL,
        "operation"   "service_reminder"."history_operation_enum"     NOT NULL,
        "createdOn"   bigint                                          NOT NULL,
        "updatedOn"   bigint                                          NOT NULL,
        "createdBy"   integer,
        "updatedBy"   integer,
        CONSTRAINT "PK_e0299b6e118fc8bbe027e135ef3" PRIMARY KEY ("id")
      )
    `);

    // ─── user_history ─────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "service_reminder"."user_history" (
        "id"          SERIAL                                          NOT NULL,
        "entityId"    integer                                         NOT NULL,
        "data"        text                                            NOT NULL,
        "operation"   "service_reminder"."history_operation_enum"     NOT NULL,
        "createdOn"   bigint                                          NOT NULL,
        "updatedOn"   bigint                                          NOT NULL,
        "createdBy"   integer,
        "updatedBy"   integer,
        CONSTRAINT "PK_777252b9045d8011ab83c5b0834" PRIMARY KEY ("id")
      )
    `);

    // ─── service_history ──────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "service_reminder"."service_history" (
        "id"          SERIAL                                          NOT NULL,
        "entityId"    integer                                         NOT NULL,
        "data"        text                                            NOT NULL,
        "operation"   "service_reminder"."history_operation_enum"     NOT NULL,
        "createdOn"   bigint                                          NOT NULL,
        "updatedOn"   bigint                                          NOT NULL,
        "createdBy"   integer,
        "updatedBy"   integer,
        CONSTRAINT "PK_87a290fb43cabe61c55e0481dce" PRIMARY KEY ("id")
      )
    `);

    // ─── recurring_item_history ───────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "service_reminder"."recurring_item_history" (
        "id"          SERIAL                                          NOT NULL,
        "entityId"    integer                                         NOT NULL,
        "data"        text                                            NOT NULL,
        "operation"   "service_reminder"."history_operation_enum"     NOT NULL,
        "createdOn"   bigint                                          NOT NULL,
        "updatedOn"   bigint                                          NOT NULL,
        "createdBy"   integer,
        "updatedBy"   integer,
        CONSTRAINT "PK_7af4d6b076738d259c1542573b6" PRIMARY KEY ("id")
      )
    `);

    // ─── appointment_history ──────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "service_reminder"."appointment_history" (
        "id"          SERIAL                                          NOT NULL,
        "entityId"    integer                                         NOT NULL,
        "data"        text                                            NOT NULL,
        "operation"   "service_reminder"."history_operation_enum"     NOT NULL,
        "createdOn"   bigint                                          NOT NULL,
        "updatedOn"   bigint                                          NOT NULL,
        "createdBy"   integer,
        "updatedBy"   integer,
        CONSTRAINT "PK_e2580899aa87ff1935c8d793181" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "service_reminder"."appointment_history"`,
    );
    await queryRunner.query(
      `DROP TABLE "service_reminder"."recurring_item_history"`,
    );
    await queryRunner.query(`DROP TABLE "service_reminder"."service_history"`);
    await queryRunner.query(`DROP TABLE "service_reminder"."user_history"`);
    await queryRunner.query(`DROP TABLE "service_reminder"."vendor_history"`);

    // Dropped last since all history tables depend on it
    await queryRunner.query(
      `DROP TYPE "service_reminder"."history_operation_enum"`,
    );
  }
}
