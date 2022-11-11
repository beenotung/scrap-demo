import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('area'))) {
    await knex.schema.createTable('area', table => {
      table.increments('id')
      table.integer('name').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('city'))) {
    await knex.schema.createTable('city', table => {
      table.increments('id')
      table.integer('name').notNullable()
      table.integer('area_id').unsigned().notNullable().references('area.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('hotel'))) {
    await knex.schema.createTable('hotel', table => {
      table.increments('id')
      table.integer('city_id').unsigned().notNullable().references('city.id')
      table.text('code').notNullable()
      table.text('name').notNullable()
      table.text('address').notNullable()
      table.text('desc').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('offer_cat'))) {
    await knex.schema.createTable('offer_cat', table => {
      table.increments('id')
      table.integer('hotel_id').unsigned().notNullable().references('hotel.id')
      table.text('name').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('offer_item'))) {
    await knex.schema.createTable('offer_item', table => {
      table.increments('id')
      table.integer('offer_cat_id').unsigned().notNullable().references('offer_cat.id')
      table.text('name').notNullable()
      table.integer('is_available').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('hotel_image'))) {
    await knex.schema.createTable('hotel_image', table => {
      table.increments('id')
      table.integer('hotel_id').unsigned().notNullable().references('hotel.id')
      table.text('url').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('facility'))) {
    await knex.schema.createTable('facility', table => {
      table.increments('id')
      table.integer('name').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('hotel_facility'))) {
    await knex.schema.createTable('hotel_facility', table => {
      table.increments('id')
      table.integer('hotel_id').unsigned().notNullable().references('hotel.id')
      table.integer('facility_id').unsigned().notNullable().references('facility.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('room'))) {
    await knex.schema.createTable('room', table => {
      table.increments('id')
      table.text('type').notNullable()
      table.integer('hotel_id').unsigned().notNullable().references('hotel.id')
      table.integer('original_price').notNullable()
      table.integer('discount_price').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('room_tag'))) {
    await knex.schema.createTable('room_tag', table => {
      table.increments('id')
      table.integer('room_id').unsigned().notNullable().references('room.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('room_image'))) {
    await knex.schema.createTable('room_image', table => {
      table.increments('id')
      table.integer('room_id').unsigned().notNullable().references('room.id')
      table.text('url').notNullable()
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('room_image')
  await knex.schema.dropTableIfExists('room_tag')
  await knex.schema.dropTableIfExists('room')
  await knex.schema.dropTableIfExists('hotel_facility')
  await knex.schema.dropTableIfExists('facility')
  await knex.schema.dropTableIfExists('hotel_image')
  await knex.schema.dropTableIfExists('offer_item')
  await knex.schema.dropTableIfExists('offer_cat')
  await knex.schema.dropTableIfExists('hotel')
  await knex.schema.dropTableIfExists('city')
  await knex.schema.dropTableIfExists('area')
}
