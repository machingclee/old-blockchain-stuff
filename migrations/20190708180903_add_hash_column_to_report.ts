import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable("reports", table => {
    table.string("hash");
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable("reports", table => {
    table.dropColumn("hash");
  });
}
