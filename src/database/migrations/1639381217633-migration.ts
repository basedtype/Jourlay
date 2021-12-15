import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1639381217633 implements MigrationInterface {
    name = 'migration1639381217633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "game_user" ("id" SERIAL NOT NULL, "wallet" integer NOT NULL DEFAULT '0', "xp" integer NOT NULL DEFAULT '0', "hp" integer NOT NULL DEFAULT '100', "hp_max" integer NOT NULL DEFAULT '100', "adventureExpire" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_0744ead8ea37cf3325c971f5f18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "thing" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "armor" integer NOT NULL DEFAULT '0', "damage" integer NOT NULL DEFAULT '0', "heal" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_e7757c5911e20acd09faa22d1ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "world" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_9a0e469d5311d0d95ce1202c990" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discord_user" ("id" SERIAL NOT NULL, "userID" character varying NOT NULL, "warnings" integer NOT NULL, "bans" integer NOT NULL, "isMuted" character varying NOT NULL DEFAULT false, "mutedExpires" TIMESTAMP, "messages" integer NOT NULL DEFAULT '0', "minutesInVoice" integer NOT NULL DEFAULT '0', "color" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2c465db058d41ca3a50f819b0a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discord_log" ("id" SERIAL NOT NULL, "service" character varying NOT NULL, "code" integer NOT NULL DEFAULT '100', "description" character varying NOT NULL, "isRequestAttention" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8602575246eac094e5ff7b74c4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "log" ("id" SERIAL NOT NULL, "service" character varying NOT NULL, "code" integer NOT NULL DEFAULT '100', "description" character varying NOT NULL, "isRequestAttention" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service" ("id" SERIAL NOT NULL, "service" character varying, "target" character varying, "api" character varying, "secret" character varying, "login" character varying, "password" character varying, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "server_user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_7e34da2d4a9e23e3a29d1c5af0a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "server_user"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP TABLE "log"`);
        await queryRunner.query(`DROP TABLE "discord_log"`);
        await queryRunner.query(`DROP TABLE "discord_user"`);
        await queryRunner.query(`DROP TABLE "world"`);
        await queryRunner.query(`DROP TABLE "thing"`);
        await queryRunner.query(`DROP TABLE "game_user"`);
    }

}
