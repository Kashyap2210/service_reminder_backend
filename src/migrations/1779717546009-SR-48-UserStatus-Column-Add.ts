import { MigrationInterface, QueryRunner } from "typeorm";

export class SR48UserStatusColumnAdd1779717546009 implements MigrationInterface {
    name = 'SR48UserStatusColumnAdd1779717546009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "service_reminder"."user_status_enum" AS ENUM('ACTIVE', 'DELETED')`);
        await queryRunner.query(`ALTER TABLE "service_reminder"."user" ADD "status" "service_reminder"."user_status_enum" NOT NULL DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_reminder"."user" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "service_reminder"."user_status_enum"`);
    }

}
