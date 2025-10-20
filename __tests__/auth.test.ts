import request from "supertest";
import app from "../src/index"; 

describe("Auth Endpoints", () => {
  const testUser = {
    username: `testuser${Date.now()}@example.com`,
    password: "password123",
  };

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("username", testUser.username);
  });

  it("should login existing user", async () => {
    const res = await request(app).post("/api/auth/login").send(testUser);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
