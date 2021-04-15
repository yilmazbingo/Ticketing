import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successfull signup", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "dhshd",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "pa", // wont pass the validator
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "yeminsd" })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "yeminsd" })
    .expect(400);
});

//- once we set req.session, cookie-session middleware is going to send this cookie back over to user's browser inside the response. Cookie session will set a header on the response. "Set-cookie"
it("sets a cookie after a successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "yeminsd" })
    .expect(201);
  // when we first run this, it will fail.
  // when we wired up cookie session, we set 'secure:true' means we share cookie if someone makes request to the server over a https connection. supertest makes plain http request. we need to make secure:false for test env
  expect(response.get("Set-Cookie")).toBeDefined();
});
