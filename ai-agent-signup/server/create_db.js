const Database = require("better-sqlite3");
const db = new Database("db.sqlite3");

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        companyName TEXT UNIQUE NOT NULL,
        email_domain TEXT NOT NULL
        )    
    `);

  const rowCount = db
    .prepare("SELECT count(*) AS count FROM companies")
    .get().count;

  if (rowCount === 0) {
    const companies = [
      { companyName: "Acme Corp", email_domain: "acme.com" },
      { companyName: "Globex Corporation", email_domain: "globex.net" },
      { companyName: "Soylent Industries", email_domain: "soylent.biz" },
      { companyName: "Initech", email_domain: "initech.com" },
      { companyName: "Random Corporation", email_domain: "random.corp" },
    ];

    const insert = db.prepare(
      "INSERT INTO companies (companyName, email_domain) VALUES (@companyName, @email_domain)"
    );
    const insertMany = db.transaction((companies) => {
      for (const company of companies) {
        insert.run({
          companyName: company.companyName,
          email_domain: company.email_domain,
        });
      }
    });

    insertMany(companies);
    console.log("Mock data inserted");
  } else {
    console.log("Database already contains data. Skipping mock data insertion");
  }
} catch (error) {
  console.error("Database Error: ", error);
} finally {
  db.close();
  console.log("Database connection closed");
}
