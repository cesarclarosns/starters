import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "..";
import { authService } from "./auth.service";

const signInPayload = {
  email: "email@example.com",
  password: "password123",
};
const signUpPayload = {
  email: "email@example.com",
  password: "password123",
};

describe("AuthController", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("POST /auth/sign-in", () => {
    beforeAll(async () => {
      // Create user
      await authService.signUp(signUpPayload);
    });

    describe("Given the credentials are wrong", () => {
      it("Should return unauthorized if email is not registered or password is incorrect", async () => {
        const res = await supertest(app).post("/api/auth/sign-in").send({
          email: "fake",
          password: "123",
        });
        expect(res.statusCode).toBe(401);
      });
    });

    describe("Given the credentials are correct", () => {
      it("Should return a 200 and an accessToken and user in the response body", async () => {
        const res = await supertest(app)
          .post("/api/auth/sign-in")
          .send(signUpPayload);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("user");
        expect(res.body).toHaveProperty("accessToken");
      });
    });
  });
});
