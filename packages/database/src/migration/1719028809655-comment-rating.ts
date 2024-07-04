import { MigrationInterface, QueryRunner } from "typeorm";

export class commentRating1719028809655 implements MigrationInterface {
    name = 'commentRating1719028809655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "rating" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "rating"`);
    }

}
