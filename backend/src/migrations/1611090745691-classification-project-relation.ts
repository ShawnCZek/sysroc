import { MigrationInterface, QueryRunner } from 'typeorm';

export class classificationProjectRelation1611090745691 implements MigrationInterface {
    name = 'classificationProjectRelation1611090745691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classification" DROP CONSTRAINT "FK_6368e7a482976db7bfe7131f240"`);
        await queryRunner.query(`ALTER TABLE "classification" ADD CONSTRAINT "FK_6368e7a482976db7bfe7131f240" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classification" DROP CONSTRAINT "FK_6368e7a482976db7bfe7131f240"`);
        await queryRunner.query(`ALTER TABLE "classification" ADD CONSTRAINT "FK_6368e7a482976db7bfe7131f240" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
