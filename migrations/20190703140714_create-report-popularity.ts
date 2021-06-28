import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("report_popularity", table => {
    table.increments();
    table.integer("report_id").unsigned();
    table.foreign("report_id").references("reports.id");
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.boolean("like").notNullable();
    table.boolean("dislike").notNullable();
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("report_popularity");
}
