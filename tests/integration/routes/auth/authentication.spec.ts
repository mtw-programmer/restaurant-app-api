import request from 'supertest';
import server from '../../../../index';
import jwt from 'jsonwebtoken';

import Admin from '../../../../models/Admin';
import config from '../../../../utils/config';
import clearDB from '../../helpers/clearDB';

describe('POST /api/authentication', () => {
  beforeAll(() => clearDB());

  const exec = async (body:object) => request(server).post('/api/authentication').send(body);
  
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

  it('should return 400 when no request body', async () => {
    const res = await request(server).post('/api/authentication').send();
    expect(res.status).toBe(400);
  });
  
  it('should return 400 when username is not a string type', async () => {
    const res = await exec({ username: {}, password: '1234567890' });
    expect(res.status).toBe(400);
  });
  
  it('should return 400 when password is not a string type', async () => {
    const res = await exec({ username: 'admin', password: {} });
    expect(res.status).toBe(400);
  });
  
  it('should return 400 when no username given', async () => {
    const res = await exec({ password: '1234567890' });
    expect(res.status).toBe(400);
  });
  
  it('should return 400 when no password given', async () => {
    const res = await exec({ username: 'admin' });
    expect(res.status).toBe(400);
  });
  
  it('should return 400 when username is incorrect', async () => {
    const res = await exec({ username: 'admin1', password: '1234567890' });
    expect(res.status).toBe(400);
  });
  
  it('should return 400 when password is incorrect', async () => {
    const res = await exec({ username: 'admin', password: '123456789' });
    expect(res.status).toBe(400);
  });
  
  it('should return a valid jwt when credentials are correct', async () => {
    const res = await exec({ username: 'admin', password: '1234567890' });
    expect(res.status).toBe(200);
    
    const token = res.headers['x-auth-token'];

    jwt.verify(token, config.TOKEN_SECRET, async (_err, decoded) => {
      const { id } = decoded;

      const result = await Admin.findOne({ _id: id }).select('_id');

      expect(id).toEqual(`${result._id}`);
    });
  });
});
