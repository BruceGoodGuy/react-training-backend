const db = require("../config/db");

const Liability = {
  createTable: async () => {
    await db.schema.hasTable("liabilities").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("liabilities", (table) => {
          table.increments("id").primary();
          table.integer("kycid").notNullable();
          table.enu("type", [0, 1, 2]).notNullable(); // 0 for Personal Loan, 1 for  Real Estate Loan and 2 for Others.
          table.decimal("amount", 10, 2).notNullable();
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created liabilities table");
      }
    });
  },

  getAll: () => db("liabilities").select("*"),

  getById: (id) => db("liabilities").where({ id }).first(),
  getByKycId: (kycid) => db("liabilities").where({ kycid }).select("*"),
  create: (liability) => db("liabilities").insert(liability).returning("*"),

  getByUserId: (userid) => db("liabilities").where({ userid }).select("*"),
  deleteByKycId: (kycid) => db("liabilities").where({ kycid }).del(),
  update: (id, updates) => db("liabilities").where({ id }).update(updates),

  delete: (id) => db("liabilities").where({ id }).del(),
  deleteByUserId: (userid) => db("liabilities").where({ userid }).del(),
  batchInsert: (liabilities) =>
    db("liabilities").insert(liabilities).returning("*"),
};

module.exports = Liability;
