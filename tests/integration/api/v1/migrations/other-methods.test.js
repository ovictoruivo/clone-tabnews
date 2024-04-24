import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function getMigrationsResponse(method) {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method,
  });

  return response.status;
}

test("other HTTP methods to /api/v1/migrations should return 405", async () => {
  for (let notAllowedMethods of ["PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]) {
    await cleanDatabase();

    const migrationsResponse = await getMigrationsResponse(notAllowedMethods);
    expect(migrationsResponse).toBe(405);
  }
});
