import { MigrationInterface, QueryRunner } from 'typeorm';

export class projectOwner1610546825045 implements MigrationInterface {
    name = 'projectOwner1610546825045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "ownerId"`);
    }

}
