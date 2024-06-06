import supertest from "supertest";

import {app} from "../src/routers/main-router";

describe("GET /schedule/list", () => {
  it('It should return success response', async () => {
    const response = await supertest(app)
      .get('/schedule/list')

      expect(response.status).toEqual(200);
      expect(response.body.data).toBeDefined();

      console.log(response.body);
  });
}); 

describe("GET /schedule/user/:user", () => {
  it('It should return success response', async () => {
    const response = await supertest(app)
      .get('/schedule/user/2115061073')

      expect(response.status).toEqual(200);
      expect(response.body.data).toBeDefined();

      console.log(response.body);
  });

  it('It should return error user not found', async () => {
    const response = await supertest(app)
      .get('/schedule/user/211506107')

      expect(response.status).toEqual(401);
      expect(response.body.error).toBeDefined();

      console.log(response.body);
  });
}); 
