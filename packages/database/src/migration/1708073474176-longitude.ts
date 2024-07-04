import { MigrationInterface, QueryRunner } from "typeorm";

export class longitude1708073474176 implements MigrationInterface {
    name = 'longitude1708073474176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "longtitude" TO "longitude"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" RENAME COLUMN "longitude" TO "longtitude"`);
    }

}
