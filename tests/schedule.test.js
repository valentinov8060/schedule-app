import supertest from "supertest";

import {app} from "../src/routers/main-router";
import {
  createUserTest,
  removeUserTest,
  getTokenUserTest,
  removeScheduleTest,
  getIdScheduleTest
} from "./util-test";

beforeAll(async () => {
  await removeScheduleTest();
  await removeUserTest();
  await createUserTest();
});

afterAll(async () => {
  await removeUserTest();
});

describe("POST /schedule/create", () => {
  it('It should return success response', async () => {
    const token = getTokenUserTest();
    const response = await supertest(app)
      .post('/schedule/create')
      .set('Authorization', token)
      .send({
        mata_kuliah : "Test",
        nama_kelas : "T",
        sks : "2",
        hari : "Selasa",
        jam_mulai : "080000",
        jam_selesai : "090000",
        ruangan  : "Test"
      })

      expect(response.status).toEqual(200);
      expect(response.body.data.mata_kuliah).toEqual('Test');
      expect(response.body.data.nama_kelas).toEqual('T');

      console.log(response.body);
  });

  it('It should return error Kelas sudah ada', async () => {
    const token = getTokenUserTest();
    const response = await supertest(app)
      .post('/schedule/create')
      .set('Authorization', token)
      .send({
        mata_kuliah : "Test",
        nama_kelas : "T",
        sks : "2",
        hari : "Selasa",
        jam_mulai : "080000",
        jam_selesai : "090000",
        ruangan  : "Test"
      })

      expect(response.status).toEqual(401);
      expect(response.body.error).toEqual('Kelas sudah ada');

      console.log(response.body);
  });

  it('It should return error Jadwal Bentrok', async () => {
    const token = await getTokenUserTest();
    const response = await supertest(app)
      .post('/schedule/create')
      .set('Authorization', token)
      .send({
        mata_kuliah : "Test",
        nama_kelas : "invalid",
        sks : "2",
        hari : "Selasa",
        jam_mulai : "080000",
        jam_selesai : "090000",
        ruangan  : "Test"
      })

      expect(response.status).toEqual(401);
      expect(response.body.error).toEqual('Jadwal bentrok');

      console.log(response.body);
  });
}); 

describe("PUT /schedule/update/:id_mata_kuliah", () => {
  it('It should return success response', async () => {
    const idMataKuliah = await getIdScheduleTest();
    const token = await getTokenUserTest();
    const response = await supertest(app)
      .put(`/schedule/update/${idMataKuliah}`)
      .set('Authorization', token)
      .send({
        mata_kuliah : "Test",
        nama_kelas : "T",
        sks : "2",
        hari : "Kamis",
        jam_mulai : "080000",
        jam_selesai : "090000",
        ruangan  : "Test"
      })

      expect(response.status).toEqual(200);
      expect(response.body.data.mata_kuliah).toEqual('Test');
      expect(response.body.data.hari).toEqual('Kamis');

      console.log(response.body);
  });

  it('It should return error Jadwal bentrok', async () => {
    const idMataKuliah = await getIdScheduleTest();
    const token = await getTokenUserTest();
    const response = await supertest(app)
      .put(`/schedule/update/${idMataKuliah}`)
      .set('Authorization', token)
      .send({
        mata_kuliah : "Test",
        nama_kelas : "T",
        sks : "2",
        hari : "Kamis",
        jam_mulai : "080000",
        jam_selesai : "090000",
        ruangan  : "Test"
      })

      expect(response.status).toEqual(401);
      expect(response.body.error).toEqual('Jadwal bentrok');

      console.log(response.body);
  });
}); 

describe("DELETE /schedule/remove/:id_mata_kuliah", () => {
  it('It should return success response', async () => {
    const idMataKuliah = await getIdScheduleTest();
    const token = await getTokenUserTest();
    const response = await supertest(app)
      .delete(`/schedule/remove/${idMataKuliah}`)
      .set('Authorization', token)

      expect(response.status).toEqual(200);
      expect(response.body.data).toEqual('Mata Kuliah Berhasil Dihapus');

      console.log(response.body);
  });

  it('It should return error id_matkul not found or not your schedule', async () => {
    const token = await getTokenUserTest();
    const response = await supertest(app)
      .delete(`/schedule/remove/7a54d32e-d96f-4d55-af29-254f526420ce`)
      .set('Authorization', token)

      expect(response.status).toEqual(401);
      expect(response.body.error).toBeDefined();

      console.log(response.body);
  });
}); 
