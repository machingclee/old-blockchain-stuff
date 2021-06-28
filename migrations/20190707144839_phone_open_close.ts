import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.alterTable("shops", table => {
    table.string("phone");
    table.string("open");
    table.string("close");
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.alterTable("shops", table => {
    table.dropColumn("phone");
    table.dropColumn("open");
    table.dropColumn("close");
  });
}
