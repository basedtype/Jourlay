import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1636670282308 implements MigrationInterface {
    name = 'migration1636670282308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isEmailVerified" boolean NOT NULL DEFAULT false, "emailVerificationCode" character varying, "emailVerificationCodeExpiresAt" TIMESTAMP, "resetPasswordCode" character varying, "resetPasswordCodeExpiresAt" TIMESTAMP, "isUserVerified" boolean NOT NULL DEFAULT true, "role" character varying NOT NULL DEFAULT 'webmaster', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "binance_log" ("id" SERIAL NOT NULL, "currency" character varying NOT NULL, "bidPrice" character varying NOT NULL, "askPrice" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_554be97dded320556e649344b44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discord_user" ("id" SERIAL NOT NULL, "userID" character varying NOT NULL, "warnings" integer NOT NULL, "bans" integer NOT NULL, "isMuted" character varying NOT NULL DEFAULT false, "mutedExpires" TIMESTAMP, "messages" integer NOT NULL DEFAULT '0', "minutesInVoice" integer NOT NULL DEFAULT '0', "color" character varying, CONSTRAINT "PK_2c465db058d41ca3a50f819b0a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discord_log" ("id" SERIAL NOT NULL, "service" character varying NOT NULL, "code" integer NOT NULL DEFAULT '100', "description" character varying NOT NULL, "isRequestAttention" boolean NOT NULL DEFAULT false, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8602575246eac094e5ff7b74c4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "log" ("id" SERIAL NOT NULL, "service" character varying NOT NULL, "code" integer NOT NULL DEFAULT '100', "description" character varying NOT NULL, "isRequestAttention" boolean NOT NULL DEFAULT false, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service" ("id" SERIAL NOT NULL, "service" character varying NOT NULL, "target" character varying NOT NULL, "api" character varying, "secret" character varying, "login" character varying, "password" character varying, "description" character varying, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "server_user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_7e34da2d4a9e23e3a29d1c5af0a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "server_user"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP TABLE "log"`);
        await queryRunner.query(`DROP TABLE "discord_log"`);
        await queryRunner.query(`DROP TABLE "discord_user"`);
        await queryRunner.query(`DROP TABLE "binance_log"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
