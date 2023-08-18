import request from 'supertest';
import server from '../../../index';

import Admin from '../../../models/Admin';
import config from '../../../utils/config';
import clearDB from '../helpers/clearDB';

describe('POST /api/verify-token', () => {
  beforeAll(() => clearDB());

  const exec = async (token:any) => request(server).post('/api/verify-token').set('x-auth-token', token).send();
  
  beforeEach(async () => {
    const admin = new Admin({
      username: 'admin',
      password: '$2b$15$pzOZ8lWcsbaVpbLR3ojYYejZ8cNqZ8ee1DTJwmXWG/bCMdLg7zpPe', //1234567890
      email: 'a@vp.pl'
    });
    await admin.save();
  });

  afterEach(() => clearDB());
  afterAll(() => {
    server.close();
  });

  it('should return 401 when no token provided', async () => {
    const res = await request(server).post('/api/verify-token').send();
    expect(res.status).toBe(401);
  });
  
  it('should return 401 when token is not a string type', async () => {
    const res = await exec({});
    expect(res.status).toBe(400);
  });

  it('should return 401 when token is not valid', async () => {
    const res = await exec('1');
    expect(res.status).toBe(400);
  });
  
  it('should return 400 when token does not store valid admin _id', async () => {
    const res = await exec('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2OTIzOTM1MzEsImV4cCI6MTY5MjM5NzEzMX0.BiykhELT1JaWUL0Rg0qfO8YLRfQ8SfmpLinPxz4qtI8');
    expect(res.status).toBe(400);
  });
  
  it('should return 200 when token is valid and contain admin _id', async () => {
    const res = await request(server).post('/api/authentication').send({ username: 'admin', password: '1234567890' });
    const token = res.header['x-auth-token'];

    const result = await exec(token);
    expect(result.status).toBe(200);
  });
});
