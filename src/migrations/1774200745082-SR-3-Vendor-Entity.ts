import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR3VendorEntity1774200745082 implements MigrationInterface {
  name = 'SR3VendorEntity1774200745082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "service_reminder"."vendor" (
        "id" SERIAL NOT NULL, 
        "name" character varying(100) NOT NULL, 
        "contactNo" character varying(15) NOT NULL, 
        "email" character varying, 
        "recurringItemId" integer NOT NULL, 
        "userId" integer NOT NULL, 
        "createdOn" bigint NOT NULL, 
        "updatedOn" bigint NOT NULL, 
        "createdBy" integer, 
        "updatedBy" integer, 
      CONSTRAINT "PK_931a23f6231a57604f5a0e32780" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service_reminder"."vendor"`);
  }
}
