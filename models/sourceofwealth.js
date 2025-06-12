const db = require("../config/db");

const SourceOfWealth = {
  createTable: async () => {
    await db.schema.hasTable("sourceofwealths").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("sourceofwealths", (table) => {
          table.increments("id").primary();
          table.integer("kycid").notNullable();
          table.enu("type", [0, 1]).notNullable(); // 0 for Inheritance, 1 for Donation.
          table.decimal("amount", 10, 2).notNullable();
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created sourceofwealths table");
      }
    });
  },

  getAll: () => db("sourceofwealths").select("*"),

  getById: (id) => db("sourceofwealths").where({ id }).first(),
  getByKycId: (kycid) => db("sourceofwealths").where({ kycid }).select("*"),
  create: (sourceOfWealth) =>
    db("sourceofwealths").insert(sourceOfWealth).returning("*"),

  getByUserId: (userid) => db("sourceofwealths").where({ userid }).select("*"),

  update: (id, updates) => db("sourceofwealths").where({ id }).update(updates),

  delete: (id) => db("sourceofwealths").where({ id }).del(),
  deleteByKycId: (kycid) => db("sourceofwealths").where({ kycid }).del(),
  deleteByUserId: (userid) => db("sourceofwealths").where({ userid }).del(),
  batchInsert: (sourceOfWealths) =>
    db("sourceofwealths").insert(sourceOfWealths).returning("*"),
};

module.exports = SourceOfWealth;
