import { MigrationInterface, QueryRunner } from "typeorm";

export class lnglatNumber1708011970474 implements MigrationInterface {
    name = 'lnglatNumber1708011970474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "longtitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "longtitude" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "latitude" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "latitude" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "longtitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "longtitude" character varying NOT NULL`);
    }

}
