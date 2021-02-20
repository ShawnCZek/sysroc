import { MigrationInterface, QueryRunner } from 'typeorm';

export class uploadToken1613758117821 implements MigrationInterface {
    name = 'uploadToken1613758117821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" ADD "token" character(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "upload" ADD CONSTRAINT "UQ_920875e55461235e0e69ddceed6" UNIQUE ("token")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP CONSTRAINT "UQ_920875e55461235e0e69ddceed6"`);
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "token"`);
    }

}
