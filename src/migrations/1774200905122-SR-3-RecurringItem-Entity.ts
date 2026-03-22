import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR3RecurringItemEntity1774200905122 implements MigrationInterface {
  name = 'SR3RecurringItemEntity1774200905122';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "service_reminder"."recurring_item_serviceperiodunit_enum" AS ENUM('DAYS', 'WEEKS', 'MONTHS', 'YEARS')`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_reminder"."recurring_item" (
        "id" SERIAL NOT NULL, 
        "name" character varying(100) NOT NULL, 
        "type" character varying(100) NOT NULL, 
        "companyName" character varying(100), 
        "vendorId" integer, 
        "servicePeriod" integer NOT NULL, 
        "servicePeriodUnit" "service_reminder"."recurring_item_serviceperiodunit_enum" NOT NULL, 
        "servicePlaceAddress" character varying(255), 
        "userId" integer NOT NULL, 
        "createdOn" bigint NOT NULL, 
        "updatedOn" bigint NOT NULL, 
        "createdBy" integer, 
        "updatedBy" integer, 
      CONSTRAINT "PK_7672be0e5abba29c062185c9f49" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service_reminder"."cronjob"`);
    await queryRunner.query(`DROP TABLE "service_reminder"."recurring_item"`);
  }
}
