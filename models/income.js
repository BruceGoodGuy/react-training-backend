const db = require("../config/db");

const Income = {
  createTable: async () => {
    await db.schema.hasTable("incomes").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("incomes", (table) => {
          table.increments("id").primary();
          table.integer("kycid").notNullable();
          table.enu("type", [0, 1, 2]).notNullable(); // 0 for Salary, 1 for Investment and 2 for Others.
          table.decimal("amount", 10, 2).notNullable();
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created incomes table");
      }
    });
  },

  getAll: () => db("incomes").select("*"),

  getById: (id) => db("incomes").where({ id }).first(),
  getByKycId: (kycid) => db("incomes").where({ kycid }).select("*"),
  create: (income) => db("incomes").insert(income).returning("*"),

  getByUserId: (userid) => db("incomes").where({ userid }).select("*"),

  update: (id, updates) => db("incomes").where({ id }).update(updates),

  delete: (id) => db("incomes").where({ id }).del(),
  deleteByUserId: (userid) => db("incomes").where({ userid }).del(),
  batchInsert: (incomes) => db("incomes").insert(incomes).returning("*"),
};

module.exports = Income;
