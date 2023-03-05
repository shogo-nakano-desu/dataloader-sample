import { MigrationInterface, QueryRunner } from "typeorm"

export class authorRefactoring1677986185171 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "author" ADD COLUMN country VARCHAR`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "author" DROP COLUMN country`
        )
    }

}

