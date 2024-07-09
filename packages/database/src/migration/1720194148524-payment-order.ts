import { MigrationInterface, QueryRunner } from "typeorm";

export class paymentOrder1720194148524 implements MigrationInterface {
    name = 'paymentOrder1720194148524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "test" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "test"`);
    }

}
