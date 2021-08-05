import dotenv from "dotenv";
dotenv.config({});
import request from 'supertest';
import { Express } from 'express-serve-static-core';
import { createApp } from '../Common/app';
import User from "../User/user.model";

let app: Express;
const userData = {
  email: 'abc@abc.com', 
  password: '123456', 
  username: 'abc'
};

jest.setTimeout(30000);

beforeAll(() => {
  app = createApp();
})

afterEach(async () => {
  await User.deleteMany();
});

describe('POST /login', () => {
  it('should return 403 because of password mismatch', async () => {
    await User.build(userData).save();
    const res = await request(app)
                      .post(`/login`)
                      .send({ ...userData, password: '123' });
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid Password');
  })

  it('should redirect with new token', async () => {
    await User.build(userData).save();
    const res = await request(app)
                      .post(`/login`)
                      .send(userData);
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe('/');
    expect(res.header['set-cookie'].length).toBeGreaterThanOrEqual(1);
  })
})

describe('POST /signup', () => {
  it('should return 403 because user already exists', async () => {
    await User.build(userData).save();
    const res = await request(app)
                      .post(`/signup`)
                      .send(userData);
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('User Already Exist');
  })

  it('should redirect with new token', done => {
    request(app)
      .post(`/signup`)
      .send(userData)
      .expect(302)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.header.location).toBe('/');
        expect(res.header['set-cookie'].length).toBeGreaterThanOrEqual(1);
        done();
      })
  })
})