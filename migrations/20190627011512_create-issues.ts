import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("issues", table => {
    table.increments();
    table.string("name").notNullable();
    table.text("description");
    table.string("photo");
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("issues");
}
