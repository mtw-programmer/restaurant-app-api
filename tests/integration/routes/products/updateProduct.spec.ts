import request from 'supertest';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import _ from 'lodash';
import config from '../../../../utils/config';
import server from '../../../../index';
import Product from '../../../../models/Product';
import Admin from '../../../../models/Admin';
import clearDB from '../../helpers/clearDB';

describe('PATCH /api/dashboard/update-product/:id', () => {
  beforeAll(() => clearDB());

  let productId:string|undefined;
  let token:string|undefined;

  const testImage = async (source:string) => {
    const oldProduct = await Product.findOne({ _id: productId }).select('img');

    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .attach('img', `tests/integration/helpers/media/${source}`);

    const updatedProduct = await Product.findOne({ _id: productId }).select('img');
    const path = `./media/products/${productId}/`;

    return { oldProduct, res, updatedProduct, path };
  };
  
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
  afterAll(() => {
    server.close();
  });

  it('should return 401 when no token provided', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .field('title', 'Valid Title');
    
    expect(res.status).toBe(401);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when token is not valid', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', '1')
      .field('title', 'Valid Title');
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when token does not store valid admin _id', async () => {
    const payload = { id: new Types.ObjectId() };
    const token = await jwt.sign(payload, config.TOKEN_SECRET);
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('title', 'Valid Title');
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when id is invalid', async () => {
    const id = new Types.ObjectId();
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${id}`)
      .set('x-auth-token', token)
      .field('title', 'Valid Title');
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when id is not a valid mongoose ID', async () => {
    const id = { test: 'Do not throw pls' };
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${id}`)
      .set('x-auth-token', token)
      .field('title', 'Valid Title');
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when no properties given to update', async () => {
    const res = await 
      request(server)
        .patch(`/api/dashboard/update-product/${productId}`)
        .set('x-auth-token', token);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when invalid property given', async () => {
    const res = await 
      request(server)
        .patch(`/api/dashboard/update-product/${productId}`)
        .set('x-auth-token', token)
        .field('invalid', 'value');
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when title is less than 1 char', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('title', '');
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when title is longer than 30 chars', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('title', Array(32).join('a'));
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when description is less than 1 char', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('description', '');
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when description is longer than 1024 chars', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('description', Array(1026).join('a'));
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when price is less than 0.01', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('price', 0.001);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when price is more than 9999999', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('price', 9999999.01);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 and update product when given title is valid', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('title', 'Updated Title');

    const updatedProduct = await Product.findOne({ _id: productId });
    
    expect(res.status).toBe(200);
    expect(updatedProduct?.title).toBe('Updated Title');
    expect(updatedProduct?.img).toBe('test.png');
    expect(updatedProduct?.description).toBe('D1');
    expect(updatedProduct?.price).toBe(0.02);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 and update product when given description is valid', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('description', 'Updated Description');

    const updatedProduct = await Product.findOne({ _id: productId });
    
    expect(res.status).toBe(200);
    expect(updatedProduct?.title).toBe('P1');
    expect(updatedProduct?.img).toBe('test.png');
    expect(updatedProduct?.description).toBe('Updated Description');
    expect(updatedProduct?.price).toBe(0.02);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 and update product when given price is valid', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('price', 5.99);

    const updatedProduct = await Product.findOne({ _id: productId });
    
    expect(res.status).toBe(200);
    expect(updatedProduct?.title).toBe('P1');
    expect(updatedProduct?.img).toBe('test.png');
    expect(updatedProduct?.description).toBe('D1');
    expect(updatedProduct?.price).toBe(5.99);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when given image has not a valid extension', async () => {
    const { oldProduct, res, updatedProduct } = await testImage('test.txt');
    expect(res.status).toBe(400);
    expect(oldProduct?.title).toBe(updatedProduct?.title);
    expect(oldProduct?.img).toBe(updatedProduct?.img);
    expect(oldProduct?.description).toBe(updatedProduct?.description);
    expect(oldProduct?.price).toBe(updatedProduct?.price);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 and update product when given image is a valid jpg and delete the old image', async () => {
    const { oldProduct, res, updatedProduct, path } = await testImage('test.jpg');
    
    expect(res.status).toBe(200);
    expect(updatedProduct.img).not.toBe('test.png');
    expect(fs.existsSync(`${path}${updatedProduct.img}`)).toBeTruthy();
    expect(fs.existsSync(`${path}${oldProduct.img}`)).toBeFalsy();
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 and update product when given image is a valid jpeg and delete the old image', async () => {
    const { oldProduct, res, updatedProduct, path } = await testImage('test.jpeg');
    
    expect(res.status).toBe(200);
    expect(updatedProduct.img).not.toBe('test.png');
    expect(fs.existsSync(`${path}${updatedProduct.img}`)).toBeTruthy();
    expect(fs.existsSync(`${path}${oldProduct.img}`)).toBeFalsy();
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 and update product when given image is a valid png and delete the old image', async () => {
    const { oldProduct, res, updatedProduct, path } = await testImage('test.png');
    
    expect(res.status).toBe(200);
    expect(updatedProduct.img).not.toBe('test.png');
    expect(fs.existsSync(`${path}${updatedProduct.img}`)).toBeTruthy();
    expect(fs.existsSync(`${path}${oldProduct.img}`)).toBeFalsy();
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 and update product when given image is a valid gif and delete the old image', async () => {
    const { oldProduct, res, updatedProduct, path } = await testImage('test.gif');
    
    expect(res.status).toBe(200);
    expect(updatedProduct.img).not.toBe('test.png');
    expect(fs.existsSync(`${path}${updatedProduct.img}`)).toBeTruthy();
    expect(fs.existsSync(`${path}${oldProduct.img}`)).toBeFalsy();
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 and update product when given image and another property', async () => {
    const oldProduct = await Product.findOne({ _id: productId }).select('img');

    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('title', 'Updated Title')
      .attach('img', 'tests/integration/helpers/media/test.jpg');

    const updatedProduct = await Product.findOne({ _id: productId }).select('title img');
    const path = `./media/products/${productId}/`;

    expect(res.status).toBe(200);
    expect(updatedProduct.img).not.toBe('test.png');
    expect(updatedProduct.title).toBe('Updated Title');
    expect(fs.existsSync(`${path}${updatedProduct.img}`)).toBeTruthy();
    expect(fs.existsSync(`${path}${oldProduct.img}`)).toBeFalsy();
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 and update product when two field properties given', async () => {
    const res = await
      request(server)
      .patch(`/api/dashboard/update-product/${productId}`)
      .set('x-auth-token', token)
      .field('title', 'Updated Title')
      .field('price', 5.99);

    const updatedProduct = await Product.findOne({ _id: productId }).select('title price');

    expect(res.status).toBe(200);
    expect(updatedProduct.title).toBe('Updated Title');
    expect(updatedProduct.price).toBe(5.99);
    expect(res.body.msg).toBeDefined();
  });
});
