import request from "supertest";
import app from "../src/index"; 

let token: string;

beforeAll(async () => {
  const testUser = {
    username: `taskuser${Date.now()}@example.com`,
    password: "password123",
  };

  // Register test user
  await request(app).post("/api/auth/register").send(testUser);

  // Login and get JWT token
  const res = await request(app).post("/api/auth/login").send(testUser);
  token = res.body.token;
});

describe("Tasks Endpoints", () => {
  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task", description: "Test description" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", "Test Task");
  });

  it("should fetch tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
