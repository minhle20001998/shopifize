import { MigrationInterface, QueryRunner } from "typeorm";

export class productDescription1718641314052 implements MigrationInterface {
    name = 'productDescription1718641314052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
    }

}
