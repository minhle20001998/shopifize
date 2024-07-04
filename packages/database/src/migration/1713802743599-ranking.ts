import { MigrationInterface, QueryRunner } from "typeorm";

export class ranking1713802743599 implements MigrationInterface {
    name = 'ranking1713802743599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ranking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "viewCount" integer NOT NULL, "test" character varying NOT NULL, "productId" uuid, CONSTRAINT "REL_f5f084e5fe53680f84c40adcb4" UNIQUE ("productId"), CONSTRAINT "PK_bf82b8f271e50232e6a3fcb09a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ranking" ADD CONSTRAINT "FK_f5f084e5fe53680f84c40adcb4d" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ranking" DROP CONSTRAINT "FK_f5f084e5fe53680f84c40adcb4d"`);
        await queryRunner.query(`DROP TABLE "ranking"`);
    }

}
