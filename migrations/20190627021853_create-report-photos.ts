import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("report_photos", table => {
    table.increments();
    table.string("photo").notNullable();
    table.integer("report_id").unsigned();
    table.foreign("report_id").references("reports.id");
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists("report_photos");
}
