import { MigrationInterface, QueryRunner } from 'typeorm';

export class upload1613136934482 implements MigrationInterface {
    name = 'upload1613136934482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "upload" ("id" SERIAL NOT NULL, "path" character varying NOT NULL, "size" integer NOT NULL, "type" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "projectId" integer, CONSTRAINT "UQ_a5149969b8586d57b94b7fba731" UNIQUE ("path"), CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "upload" ADD CONSTRAINT "FK_a3a6a90cb93dd1544078e92c6e9" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upload" DROP CONSTRAINT "FK_a3a6a90cb93dd1544078e92c6e9"`);
        await queryRunner.query(`DROP TABLE "upload"`);
    }

}
