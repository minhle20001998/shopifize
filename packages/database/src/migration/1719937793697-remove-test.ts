import { MigrationInterface, QueryRunner } from "typeorm";

export class removeTest1719937793697 implements MigrationInterface {
    name = 'removeTest1719937793697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "test"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "test" character varying NOT NULL`);
    }

}
