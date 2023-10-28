import request from 'supertest';
import mongoose, { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import _ from 'lodash';
import config from '../../../../utils/config';
import server from '../../../../index';
import Product from '../../../../models/Product';
import Admin from '../../../../models/Admin';
import clearDB from '../../helpers/clearDB';

describe('DELETE /api/dashboard/delete-product/:id', () => {
  beforeAll(() => clearDB());

  const exec = async (token:any, id:any) => 
    request(server)
      .delete(`/api/dashboard/delete-product/${id}`)
      .set('x-auth-token', token)
      .send();

  let productId:string|undefined;
  let token:string|undefined;
  
  beforeEach(async () => {
    const toSave = [
      new Product({
        title: 'P1',
        img: 'test.png',
        description: 'D1',
        price: '0.02'
      }),
      new Admin({
        username: 'admin',
        password: '$2b$15$pzOZ8lWcsbaVpbLR3ojYYejZ8cNqZ8ee1DTJwmXWG/bCMdLg7zpPe', //1234567890
        email: 'a@vp.pl'
      })
    ];

    const { _id } = await toSave[0].save();
    productId = `${_id}`;

    await toSave[1].save();

    const res = await request(server).post('/api/authentication').send({ username: 'admin', password: '1234567890' });
    token = res.header['x-auth-token'];
  });

  afterEach(() => clearDB());
  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  it('should return 401 when no token provided', async () => {
    const res = await
      request(server)
        .delete(`/api/dashboard/delete-product/${productId}`)
        .send();
    
    expect(res.status).toBe(401);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 401 when token is not valid', async () => {
    const res = await exec('1', productId);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when token does not store valid admin _id', async () => {
    const payload = { id: new Types.ObjectId() };
    const token = await jwt.sign(payload, config.TOKEN_SECRET);
    const res = await exec(token, productId);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when id is invalid', async () => {
    const id = new Types.ObjectId();
    const res = await exec(token, `${id}`);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when id is not a valid mongoose ID', async () => {
    const res = await exec(token, { test: 'Do not throw pls ;)' });
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 and delete the product and files when everything is okay', async () => {
    const res = await exec(token, productId);
    expect(res.status).toBe(200);
    expect(res.body.msg).toBeDefined();
    expect(await Product.exists({ _id: productId })).toBeFalsy();
    expect(fs.existsSync(`./media/products/${productId}`)).toBeFalsy();
  });
});
