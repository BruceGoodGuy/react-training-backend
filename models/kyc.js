const db = require("../config/db");

const KYC = {
  createTable: async () => {
    await db.schema.hasTable("kyc").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("kyc", (table) => {
          table.increments("id").primary();
          table.integer("userid").notNullable();
          table.enu("status", [0, 1, 2]).notNullable(); // 0 for active, 1 for pending and 2 for inactive.
          table.enu("approve_status", [0, 1, 2]).notNullable(); // 0 for pending, 1 for approved and 2 for rejected.
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created kyc table");
      }
    });
  },

  getAll: () => db("kyc").select("*"),

  getById: (id) => db("kyc").where({ id }).first(),

  create: (kyc) => db("kyc").insert(kyc).returning("*"),

  getByUserId: (userid) => db("kyc").where({ userid }).select("*"),

  update: (id, updates) => db("kyc").where({ id }).update(updates),

  delete: (id) => db("kyc").where({ id }).del(),
};

module.exports = KYC;
