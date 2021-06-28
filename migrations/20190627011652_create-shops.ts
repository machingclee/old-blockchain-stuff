import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("shops", table => {
    table.increments();
    table.string("name").notNullable();
    table.string("district");
    table.string("address");
    table.string("industry");
    table.string("profile_picture");
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("shops");
}
