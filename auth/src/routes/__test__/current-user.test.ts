import request from "supertest";
import { app } from "../../app";

it("response with details about current user", async () => {
  const authResponse = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  //   const cookie = authResponse.get("Set-Cookie"); THIS IS MANUAL
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  console.log(response.body); // { currentUser: null }
  // Browser and postman have some functionality included inside them to automatically manage cookies and send cookie data along with any follow up requests.
  // SuperTest by defaut is not going to manage cookies for us automatically.
  // in the first post request, we get cookie but that is not included with the follow up request, so {currentUser:null}
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated ", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
