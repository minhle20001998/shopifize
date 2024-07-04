import { MigrationInterface, QueryRunner } from "typeorm";

export class ranking21713802890937 implements MigrationInterface {
    name = 'ranking21713802890937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" DROP COLUMN "test"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" ADD "test" character varying NOT NULL`);
    }

}
