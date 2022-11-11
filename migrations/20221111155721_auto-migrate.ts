import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('feature_group', table => {
    table.text('name').notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('feature_group', table => {
    table.integer('name').notNullable().alter()
  })
}
