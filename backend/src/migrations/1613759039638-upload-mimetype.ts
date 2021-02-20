import { MigrationInterface, QueryRunner } from 'typeorm';

export class uploadMimetype1613759039638 implements MigrationInterface {
    name = 'uploadMimetype1613759039638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" ADD "mimetype" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP COLUMN "mimetype"`);
    }

}
