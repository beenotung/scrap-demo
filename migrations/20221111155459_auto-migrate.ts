import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('feature_group'))) {
    await knex.schema.createTable('feature_group', table => {
      table.increments('id')
      table.integer('name').notNullable()
      table.integer('hotel_id').unsigned().notNullable().references('hotel.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('feature'))) {
    await knex.schema.createTable('feature', table => {
      table.increments('id')
      table.integer('feature_group_id').unsigned().notNullable().references('feature_group.id')
      table.text('name').notNullable()
      table.integer('is_available').notNullable()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('feature')
  await knex.schema.dropTableIfExists('feature_group')
}
