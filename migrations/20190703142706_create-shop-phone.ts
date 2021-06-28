import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("shop_phone", table => {
    table.increments();
    table.integer("shop_id").unsigned();
    table.foreign("shop_id").references("shops.id");
    table.string("number").notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("shop_phone");
}
