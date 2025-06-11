const db = require("../config/db");

const Investment = {
  createTable: async () => {
    await db.schema.hasTable("investments").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("investments", (table) => {
          table.increments("id").primary();
          table.integer("kycid").notNullable();
          table.enu("experience", [0, 1, 2]).notNullable(); // 0 for < 5 years, 1 for > 5 and < 10 years and 2 for > 10 years.
          table.enu("risk", [0, 1, 2]).notNullable(); // 0 for 10%, 1 for 30% and 2 for All-in.
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created investments table");
      }
    });
  },

  getAll: () => db("investments").select("*"),

  getById: (id) => db("investments").where({ id }).first(),
  getByKycId: (kycid) => db("investments").where({ kycid }).select("*"),
  create: (investment) => db("investments").insert(investment).returning("*"),

  getByUserId: (userid) => db("investments").where({ userid }).select("*"),

  update: (id, updates) => db("investments").where({ id }).update(updates),

  delete: (id) => db("investments").where({ id }).del(),
  deleteByUserId: (userid) => db("investments").where({ userid }).del(),
  batchInsert: (investments) =>
    db("investments").insert(investments).returning("*"),
};

module.exports = Investment;
