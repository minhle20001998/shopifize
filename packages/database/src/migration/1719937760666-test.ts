import { MigrationInterface, QueryRunner } from "typeorm";

export class test1719937760666 implements MigrationInterface {
    name = 'test1719937760666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "test" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "test"`);
    }

}
