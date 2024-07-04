import { MigrationInterface, QueryRunner } from "typeorm";

export class ranking31713803206015 implements MigrationInterface {
    name = 'ranking31713803206015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" RENAME COLUMN "viewCount" TO "view_count"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" RENAME COLUMN "view_count" TO "viewCount"`);
    }

}
