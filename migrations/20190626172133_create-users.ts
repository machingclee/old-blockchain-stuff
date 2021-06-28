import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("users", table => {
    table.increments();
    table.string("username");
    table.string("password");
    table.string("email");
    table.string("facebook_id");
    table.string("display_name");
    table.string("profile_picture");
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("users");
}
