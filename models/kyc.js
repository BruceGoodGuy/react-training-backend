const db = require("../config/db");
const Asset = require("../models/asset");
const Income = require("../models/income");
const Investment = require("../models/investment");
const Liability = require("../models/liability");
const SourceOfWealth = require("../models/sourceofwealth");
const User = require("../models/user");

const KYC = {
  createTable: async () => {
    await db.schema.hasTable("kyc").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("kyc", (table) => {
          table.increments("id").primary();
          table.integer("userid").notNullable();
          table.enu("status", [0, 1, 2, 3]).notNullable(); // 0 for active, 1 for pending and 2 for inactive, 3 draft.
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

  getByUserId: (userid) => db("kyc").where({ userid }).first(),

  update: (id, updates) => db("kyc").where({ id }).update(updates),

  delete: (id) => db("kyc").where({ id }).del(),
  getAllWithUserInfo: async (status) => {
    return db("kyc")
      .join("users", "kyc.userid", "=", "users.id")
      .select(
        "kyc.*",
        "users.firstname",
        "users.lastname",
        "users.middlename",
        "users.id as userId"
      )
      .where("kyc.status", status);
  },

  getAllWithUserInfoNotPendingStatus: async () => {
    return db("kyc")
      .join("users", "kyc.userid", "=", "users.id")
      .select(
        "kyc.*",
        "users.firstname",
        "users.lastname",
        "users.middlename",
        "users.id as userId"
      )
      .whereNot("kyc.status", "1");
  },

  updateStatus: async (id, status) => {
    return db("kyc")
      .where({ id })
      .update({ status })
      .then(() => KYC.getById(id));
  },
};

module.exports = KYC;
