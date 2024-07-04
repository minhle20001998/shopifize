import { MigrationInterface, QueryRunner } from "typeorm";

export class geometry1708011276144 implements MigrationInterface {
    name = 'geometry1708011276144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_status" DROP CONSTRAINT "FK_1afc453d9ab701ddf6f9a0dd4c1"`);
        await queryRunner.query(`ALTER TABLE "product_status" DROP CONSTRAINT "UQ_1afc453d9ab701ddf6f9a0dd4c1"`);
        await queryRunner.query(`ALTER TABLE "product_status" DROP COLUMN "productVariantId"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "longtitude" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD "latitude" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "longtitude"`);
        await queryRunner.query(`ALTER TABLE "product_status" ADD "productVariantId" uuid`);
        await queryRunner.query(`ALTER TABLE "product_status" ADD CONSTRAINT "UQ_1afc453d9ab701ddf6f9a0dd4c1" UNIQUE ("productVariantId")`);
        await queryRunner.query(`ALTER TABLE "product_status" ADD CONSTRAINT "FK_1afc453d9ab701ddf6f9a0dd4c1" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
