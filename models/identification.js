const db = require("../config/db");

const Identification = {
  createTable: async () => {
    await db.schema.hasTable("identifications").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("identifications", (table) => {
          table.increments("id").primary();
          table.integer("userid").notNullable();
          table.enu('type', [0, 1, 2]).notNullable(); // 0 for passport, 1 for national id card, 2 driver's license.
          table.string("file").notNullable();
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created identifications table");
      }
    });
  },

  getAll: () => db("identifications").select("*"),

  getById: (id) => db("identifications").where({ id }).first(),

  create: (number) => db("identifications").insert(number).returning("*"),

  update: (id, updates) => db("identifications").where({ id }).update(updates),

  delete: (id) => db("identifications").where({ id }).del(),
};

module.exports = Identification;
