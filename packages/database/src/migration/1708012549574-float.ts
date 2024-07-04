import { MigrationInterface, QueryRunner } from "typeorm";

export class float1708012549574 implements MigrationInterface {
    name = 'float1708012549574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "longtitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "longtitude" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "latitude" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "latitude" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "longtitude"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "longtitude" integer NOT NULL`);
    }

}
