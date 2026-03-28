import { MigrationInterface, QueryRunner } from 'typeorm';

export class SR7UserEntityColumnMetatDataChanges1774704279305 implements MigrationInterface {
  name = 'SR7UserEntityColumnMetatDataChanges1774704279305';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."user" ALTER COLUMN "name" TYPE character varying(256)`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."user" ALTER COLUMN "contactNo" TYPE character varying(32)`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."user" ALTER COLUMN "email" TYPE character varying(128)`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."user" ALTER COLUMN "password" TYPE character varying(256)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."user" ALTER COLUMN "name" TYPE character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."user" ALTER COLUMN "contactNo" TYPE character varying(15)`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."user" ALTER COLUMN "email" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_reminder"."user" ALTER COLUMN "password" TYPE character varying`,
    );
  }
}
