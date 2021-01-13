import { MigrationInterface, QueryRunner } from 'typeorm';

export class invitation1610473352856 implements MigrationInterface {
    name = 'invitation1610473352856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invitation" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "projectId" integer, "invitedId" integer, "userId" integer, CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD CONSTRAINT "FK_01d3fb6559feecba90b55aef890" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD CONSTRAINT "FK_141b01046b5a88db57340659b8a" FOREIGN KEY ("invitedId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD CONSTRAINT "FK_05191060fae5b5485327709be7f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_05191060fae5b5485327709be7f"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_141b01046b5a88db57340659b8a"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_01d3fb6559feecba90b55aef890"`);
        await queryRunner.query(`DROP TABLE "invitation"`);
    }

}
