const db = require("../config/db");

const Number = {
  createTable: async () => {
    await db.schema.hasTable("numbers").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("numbers", (table) => {
          table.increments("id").primary();
          table.integer("userid").notNullable();
          table.string("number").notNullable();
          table.enu('type', [0, 1]).notNullable(); // 0 for Work, 1 for Personal.
          table.boolean("preferred").notNullable();
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created numbers table");
      }
    });
  },

  getAll: () => db("numbers").select("*"),

  getById: (id) => db("numbers").where({ id }).first(),

  create: (number) => db("numbers").insert(number).returning("*"),

  update: (id, updates) => db("numbers").where({ id }).update(updates),

  delete: (id) => db("numbers").where({ id }).del(),
};

module.exports = Number;
