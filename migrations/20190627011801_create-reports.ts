import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("reports", table => {
    table.increments();
    table.string("title").notNullable();
    table.text("content").notNullable();
    table.boolean("stand").notNullable();
    table.integer("issue_id").unsigned();
    table.foreign("issue_id").references("issues.id");
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.integer("shop_id").unsigned();
    table.foreign("shop_id").references("shops.id");
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("reports");
}
