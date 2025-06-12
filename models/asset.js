const db = require("../config/db");

const Asset = {
  createTable: async () => {
    await db.schema.hasTable("assets").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("assets", (table) => {
          table.increments("id").primary();
          table.integer("kycid").notNullable();
          table.enu("type", [0, 1, 2, 3]).notNullable(); // 0 for Bond, 1 for Liquidity and 2 for Real Estate and 3 for Others.
          table.decimal("amount", 10, 2).notNullable();
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created assets table");
      }
    });
  },

  getAll: () => db("assets").select("*"),

  getById: (id) => db("assets").where({ id }).first(),

  create: (asset) => db("assets").insert(asset).returning("*"),

  getByUserId: (userid) => db("assets").where({ userid }).select("*"),
  getByKycId: (kycid) => db("assets").where("kycid", kycid).select("*"),

  update: (id, updates) => db("assets").where({ id }).update(updates),

  delete: (id) => db("assets").where({ id }).del(),
  deleteByUserId: (userid) => db("assets").where({ userid }).del(),
  deleteByKycId: (kycid) => db("assets").where({ kycid }).del(),
  batchInsert: (assets) => db("assets").insert(assets).returning("*"),
};

module.exports = Asset;
