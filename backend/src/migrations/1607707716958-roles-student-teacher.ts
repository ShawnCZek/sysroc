import { MigrationInterface, QueryRunner } from 'typeorm';

export class rolesStudentTeacher1607707716958 implements MigrationInterface {
    name = 'rolesStudentTeacher1607707716958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD "teacher" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ADD "student" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "admin" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "admin" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "student"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "teacher"`);
    }

}
