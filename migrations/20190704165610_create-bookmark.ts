import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTableIfNotExists("bookmark", table => {
    table.increments();
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.integer("shop_id").unsigned();
    table.foreign("shop_id").references("shops.id");
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("bookmark");
}
