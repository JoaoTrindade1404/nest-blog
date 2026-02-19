import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1771527202900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── User ───────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id"           UUID              NOT NULL DEFAULT uuid_generate_v4(),
        "name"         CHARACTER VARYING  NOT NULL,
        "email"        CHARACTER VARYING  NOT NULL,
        "password"     CHARACTER VARYING  NOT NULL,
        "forceLogout"  BOOLEAN            NOT NULL DEFAULT false,
        "createdAt"    TIMESTAMP          NOT NULL DEFAULT now(),
        "updatedAt"    TIMESTAMP          NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_user" PRIMARY KEY ("id")
      )
    `);

    // ── Post ───────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "post" (
        "id"            UUID              NOT NULL DEFAULT uuid_generate_v4(),
        "title"         CHARACTER VARYING  NOT NULL,
        "slug"          CHARACTER VARYING  NOT NULL,
        "content"       TEXT               NOT NULL,
        "excerpt"       CHARACTER VARYING  NOT NULL,
        "coverImageUrl" CHARACTER VARYING,
        "published"     BOOLEAN            NOT NULL DEFAULT false,
        "createdAt"     TIMESTAMP          NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP          NOT NULL DEFAULT now(),
        "author_id"     UUID,
        CONSTRAINT "UQ_post_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_post" PRIMARY KEY ("id"),
        CONSTRAINT "FK_post_author"
          FOREIGN KEY ("author_id") REFERENCES "user"("id")
          ON DELETE SET NULL
      )
    `);

    // ── Comment ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "comment" (
        "id"        UUID              NOT NULL DEFAULT uuid_generate_v4(),
        "content"   CHARACTER VARYING  NOT NULL,
        "createdAt" TIMESTAMP          NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP          NOT NULL DEFAULT now(),
        "author_id" UUID,
        "post_id"   UUID,
        CONSTRAINT "PK_comment" PRIMARY KEY ("id"),
        CONSTRAINT "FK_comment_author"
          FOREIGN KEY ("author_id") REFERENCES "user"("id")
          ON DELETE SET NULL,
        CONSTRAINT "FK_comment_post"
          FOREIGN KEY ("post_id") REFERENCES "post"("id")
          ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "comment"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "post"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
