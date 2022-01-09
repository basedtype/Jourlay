import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1641686159835 implements MigrationInterface {
    name = 'migration1641686159835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "nswf_entity" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "approve" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8223c5e21aa61390ece27cc95a0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "nswf_entity"`);
    }

}
