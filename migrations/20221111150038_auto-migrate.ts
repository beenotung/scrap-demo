import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('area', table => {
    table.text('name').notNullable().alter()
  })
  await knex.schema.alterTable('city', table => {
    table.text('name').notNullable().alter()
  })
  await knex.schema.alterTable('facility', table => {
    table.text('name').notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('facility', table => {
    table.integer('name').notNullable().alter()
  })
  await knex.schema.alterTable('city', table => {
    table.integer('name').notNullable().alter()
  })
  await knex.schema.alterTable('area', table => {
    table.integer('name').notNullable().alter()
  })
}
