import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR3ServiceEntityImplement1774202297878 implements MigrationInterface {
  name = 'SR3ServiceEntityImplement1774202297878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── Enums ────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "service_reminder"."service_servicetype_enum"
        AS ENUM('SERVICE', 'RUNNING REPAIR', 'GENERAL CHECK UP', 'REPEAT_REPAIR')
    `);

    await queryRunner.query(`
      CREATE TYPE "service_reminder"."service_servicestatus_enum"
        AS ENUM('SERVICE_COMMENCED', 'COMPLETED', 'CANCELLED')
    `);

    // ─── service ──────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "service_reminder"."service" (
        "id"                SERIAL                                              NOT NULL,
        "serviceDate"       bigint                                              NOT NULL,
        "recurringItemid"   integer                                             NOT NULL,
        "appointmentId"     integer,
        "userid"            integer                                             NOT NULL,
        "serviceType"       "service_reminder"."service_servicetype_enum"       NOT NULL,
        "serviceStatus"     "service_reminder"."service_servicestatus_enum"     NOT NULL DEFAULT 'SERVICE_COMMENCED',
        "vendorId"          integer,
        "serviceEstimate"   numeric(10,2),
        "serviceAmount"     numeric(10,2),
        "invoiceDocument"   character varying,
        "createdOn"         bigint                                              NOT NULL,
        "updatedOn"         bigint                                              NOT NULL,
        "createdBy"         integer,
        "updatedBy"         integer,
        CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service_reminder"."service"`);
    await queryRunner.query(
      `DROP TYPE "service_reminder"."service_servicestatus_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "service_reminder"."service_servicetype_enum"`,
    );
  }
}
