import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

// mongo is initalized in beforeAll() hook
let mongo: any;
declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
    }
  }
}

// before all isntances start up craete the mongdb server
beforeAll(async () => {
  // process.env is defiend when we run pod.
  process.env.JWT_KEY = "hehwwe";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// reset all the data
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let connection of collections) {
    await connection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "password";
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);
  const cookie = response.get("Set-Cookie");
  // console.log("Cookie in global sign in test", cookie);
  return cookie;
};
