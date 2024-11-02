import supertest from "supertest";
import 'dotenv/config';

import {app} from "../src/routers/main-router";
import {
  createUserTest,
  removeUserTest,
  getTokenUserTest,
} from "./util-test";

beforeAll(async () => {
  await removeUserTest();
  await createUserTest();
});

afterAll(async () => {
  await removeUserTest();
});

describe("POST /user/login", () => {
  it('It should return success response', async () => {
    const response = await supertest(app)
      .post('/user/login')
      .send({
        user: "test",
        password: "test"
      })

      expect(response.status).toEqual(200);
      expect(response.body.data).toBeDefined();

      console.log(response.body);
  });

  it('It should return error invalid user', async () => {
    const response = await supertest(app)
      .post('/user/login')
      .send({
        user: "invalid user",
        password: "test"
      })

    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual("Invalid user");

    console.log(response.body);
  });

  it('It should return error invalid password', async () => {
    const response = await supertest(app)
      .post('/user/login')
      .send({
        user: "test",
        password: "invalid password"
      })

    expect(response.status).toEqual(401);
    expect(response.body.error).toEqual("Invalid password");

    console.log(response.body);
  });
}); 

describe("GET /user/authentication", () => {
  it('It should return success response authentication', async () => {
    const token = getTokenUserTest();
    const response = await supertest(app)
      .get('/user/authentication')
      .set('Authorization', `${token}`);

    expect(response.status).toEqual(200);
    expect(response.body.data).toEqual("Token user test is authorized");

    console.log(response.status, response.body);
  });

  it('It should return error token Joi JWT pattern', async () => {
    const response = await supertest(app)
      .get('/user/authentication')
      .set(
        'Authorization', 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMjExNTA2MTA3MyIsImlhdCI6MTcxNzYwMTgwOSwiZXhwIjoxNzE3NjA1NDA5fQ.-sLK1pGm-gr1ms5a4-0YBBEIuWfHTyWNStj_d2DyL9E"'
      );

    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();

    console.log(response.body.error);
  });

  it('It should return error token expired', async () => {
    const response = await supertest(app)
      .get('/user/authentication')
      .set(
        'Authorization', 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMjExNTA2MTA3MyIsImlhdCI6MTcxNzYwMTgwOSwiZXhwIjoxNzE3NjA1NDA5fQ.-sLK1pGm-gr1ms5a4-0YBBEIuWfHTyWNStj_d2DyL9E'
      );

    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();

    console.log(response.body);
  });
  
  it('It should return error token false', async () => {
    const response = await supertest(app)
      .get('/user/authentication')
      .set(
        'Authorization', 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMSJ9.-_GfUEKqz4UJjJ9k7Q1G7eR_B9Dg2-9XpxbGJ4phbCk'
      );

    expect(response.status).toEqual(401);
    expect(response.body.error).toBeDefined();

    console.log(response.body);
  });
});
