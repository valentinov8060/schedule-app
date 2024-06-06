import supertest from "supertest";
import {app} from "../src/routers/main-router";

import {
  createUserTest,
  removeUserTest,
  getTokenUserTest
} from "./util-test";

describe("POST /user/login", () => {
  beforeEach(async () => {
    await removeUserTest();
    await createUserTest();
  });

  afterEach(async () => {
    await removeUserTest();
  });

  it('It should return success response', async () => {
    const result = await supertest(app)
      .post('/user/login')
      .send({
        user: "test",
        password: "test"
      })

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    console.log(result.body.data);
  });

  it('It should return error invalid user', async () => {
    const result = await supertest(app)
      .post('/user/login')
      .send({
        user: "invalid user",
        password: "test"
      })

    expect(result.status).toBe(401);
    expect(result.body.error).toBe("Invalid user");
  });

  it('It should return error invalid password', async () => {
    const result = await supertest(app)
      .post('/user/login')
      .send({
        user: "test",
        password: "invalid password"
      })

    expect(result.status).toBe(401);
    expect(result.body.error).toBe("Invalid password");
  });

}); 

describe("GET /user/authentication", () => {

  beforeEach(async () => {
    await removeUserTest();
    await createUserTest();
  });

  afterEach(async () => {
    await removeUserTest();
  });

  it('It should return success', async () => {
    const token = await getTokenUserTest();
    const result = await supertest(app)
      .get('/user/authentication')
      .set('Authorization', token);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Token user test is authorized");
  });


  it('It should return token expired', async () => {
    const result = await supertest(app)
      .get('/user/authentication')
      .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMjExNTA2MTA3MyIsImlhdCI6MTcxNzYwMTgwOSwiZXhwIjoxNzE3NjA1NDA5fQ.-sLK1pGm-gr1ms5a4-0YBBEIuWfHTyWNStj_d2DyL9E');

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });

});