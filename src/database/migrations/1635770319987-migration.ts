import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1635770319987 implements MigrationInterface {
    name = 'migration1635770319987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isEmailVerified" boolean NOT NULL DEFAULT false, "emailVerificationCode" character varying, "emailVerificationCodeExpiresAt" TIMESTAMP, "resetPasswordCode" character varying, "resetPasswordCodeExpiresAt" TIMESTAMP, "isUserVerified" boolean NOT NULL DEFAULT true, "role" character varying NOT NULL DEFAULT 'webmaster', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
