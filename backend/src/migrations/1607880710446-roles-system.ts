import { MigrationInterface, QueryRunner } from 'typeorm';

export class rolesSystem1607880710446 implements MigrationInterface {
    name = 'rolesSystem1607880710446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD "system" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "system"`);
    }

}
