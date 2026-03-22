import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR3UserEntityGenerate1774198782052 implements MigrationInterface {
  name = 'SR3UserEntityGenerate1774198782052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "service_reminder"."user_role_enum" AS ENUM('ADMIN', 'USER')`,
    );
    await queryRunner.query(`CREATE TABLE "service_reminder"."user" (
        "id" SERIAL NOT NULL, 
        "name" character varying(100) NOT NULL, 
        "contactNo" character varying(15) NOT NULL, 
        "email" character varying NOT NULL, 
        "password" character varying NOT NULL, 
        "role" "service_reminder"."user_role_enum" NOT NULL DEFAULT 'USER', 
        "createdOn" bigint NOT NULL, 
        "updatedOn" bigint NOT NULL, 
        "createdBy" integer, 
        "updatedBy" integer, 
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), 
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "service_reminder"."user"`);
    await queryRunner.query(`DROP TYPE "service_reminder"."user_role_enum"`);
  }
}
