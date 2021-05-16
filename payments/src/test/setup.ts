import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
let mongo: any;

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}

jest.mock("../nats-wrapper");
process.env.STRIPE_KEY =
  "sk_test_51IpWSSEveMq3I0sT8Li2SIGXCiJ0mDbQijl2sCpXYc5VGyZtEK20EX9gRXMvGggKCw2mmcdfsCpy9p2WoTxh5xHE00gkvT05ZE";

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

beforeEach(async () => {
  // Because same mock is used in all differetn suits. and mock keeps track of how many times it has been called
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let connection of collections) {
    await connection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // BUild a JWT payload.
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object
  const session = { jwt: token };

  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64. cookie session converts it
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
