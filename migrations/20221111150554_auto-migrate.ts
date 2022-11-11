import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.raw('alter table `city` add column `code` text null')
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw('alter table `city` drop column `code`')
}
