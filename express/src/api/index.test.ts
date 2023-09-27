import request from "supertest";
import { app } from ".";

describe("API", () => {
  describe("Given the API is running", () => {
    it("GET /api/health should return a 200", async () => {
      const res = await request(app).get("/api/health");
      expect(res.body).toEqual({ status: "up" });
      expect(res.statusCode).toBe(200);
    });
  });
});
