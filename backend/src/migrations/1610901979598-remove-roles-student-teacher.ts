import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeRolesStudentTeacher1610901979598 implements MigrationInterface {
    name = 'removeRolesStudentTeacher1610901979598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "teacher"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "student"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD "student" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "teacher" boolean NOT NULL DEFAULT false`);
    }

}
