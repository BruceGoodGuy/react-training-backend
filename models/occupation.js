const db = require("../config/db");

const Occupation = {
  createTable: async () => {
    await db.schema.hasTable("occupations").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("occupations", (table) => {
          table.increments("id").primary();
          table.integer("userid").notNullable();
          table.enu('occupation', [0, 1]).notNullable(); // 0 for employed, 1 for unemployed.
          table.date("from").notNullable();
          table.date("to").notNullable();
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created occupations table");
      }
    });
  },

  getAll: () => db("occupations").select("*"),

  getById: (id) => db("occupations").where({ id }).first(),

  create: (number) => db("occupations").insert(number).returning("*"),

  update: (id, updates) => db("occupations").where({ id }).update(updates),

  delete: (id) => db("occupations").where({ id }).del(),
};

module.exports = Occupation;
