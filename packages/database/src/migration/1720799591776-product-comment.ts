import { MigrationInterface, QueryRunner } from "typeorm";

export class productComment1720799591776 implements MigrationInterface {
    name = 'productComment1720799591776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_1e9f24a68bd2dcd6390a4008395"`);
        await queryRunner.query(`ALTER TABLE "comment" RENAME COLUMN "productId" TO "productVariantId"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_0875fb56ef92acae5dde7893d9e" FOREIGN KEY ("productVariantId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_0875fb56ef92acae5dde7893d9e"`);
        await queryRunner.query(`ALTER TABLE "comment" RENAME COLUMN "productVariantId" TO "productId"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_1e9f24a68bd2dcd6390a4008395" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
