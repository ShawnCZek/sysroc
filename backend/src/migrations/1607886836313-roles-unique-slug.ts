import { MigrationInterface, QueryRunner } from 'typeorm';

export class rolesUniqueSlug1607886836313 implements MigrationInterface {
    name = 'rolesUniqueSlug1607886836313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "UQ_35c9b140caaf6da09cfabb0d675" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "UQ_35c9b140caaf6da09cfabb0d675"`);
    }

}
