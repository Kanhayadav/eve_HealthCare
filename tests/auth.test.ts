import request from "supertest";
import app from "../src/app";
import pool from "../src/config/db";
describe("Auth API", () => {

  it("should signup a new user", async () => {
    const email = `test_${Date.now()}@example.com`;

    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "Test User",
        email,
        password: "Test@12345",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBeDefined();
  });

  it("should reject duplicate email", async () => {
    const email = `dup${Date.now()}@x.com`;

    await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "Test User",
        email,
        password: "Test@12345",
      });

    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "Another User",
        email,
        password: "Test@12345",
      });

    expect(response.status).toBe(409);
  });

  it("should reject invalid login credentials", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "doesnotexist@example.com",
        password: "wrongpassword",
      });

    expect(response.status).toBe(401);
  });

  it("should reject signup with missing fields", async () => {
    const response = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        email: `missing_${Date.now()}@example.com`,
      });

    expect(response.status).toBe(400);
  });

afterAll(async () => {
  await pool.end();
});

});