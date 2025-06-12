const db = require("../config/db");

const Contact = {
  createTable: async () => {
    await db.schema.hasTable("contacts").then(async (exists) => {
      if (!exists) {
        await db.schema.createTable("contacts", (table) => {
          table.increments("id").primary();
          table.integer("userid").notNullable();
          table.string("city").notNullable();
          table.string("country").notNullable();
          table.string("street").notNullable();
          table.string("postalcode").nullable();
          table.enu("type", [0, 1]).notNullable(); // 0 for Mailing, 1 for Work.
          table.timestamp("created_at").defaultTo(db.fn.now());
        });
        console.log("Created contacts table");
      }
    });
  },

  getAll: () => db("contacts").select("*"),

  getById: (id) => db("contacts").where({ id }).first(),

  create: (contact) => db("contacts").insert(contact).returning("*"),

  getByUserId: (userid) => db("contacts").where({ userid }).select("*"),

  update: (id, updates) => db("contacts").where({ id }).update(updates),

  delete: (id) => db("contacts").where({ id }).del(),
  deleteByUserId: (userid) => db("contacts").where({ userid }).del(),
  batchInsert: (contacts) => db("contacts").insert(contacts).returning("*"),
};

module.exports = Contact;
