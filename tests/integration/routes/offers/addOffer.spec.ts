import request from 'supertest';
import _ from 'lodash';
import server from '../../../../index';
import Product from '../../../../models/Product';
import Offer from '../../../../models/Offer';
import Admin from '../../../../models/Admin';
import clearDB from '../../helpers/clearDB';
import { Types } from 'mongoose';

describe('PUT /api/dashboard/add-offer', () => {
  beforeAll(() => clearDB());

  const exec = async (token:any, body:any) => 
    request(server)
      .put('/api/dashboard/add-offer')
      .set('x-auth-token', token)
      .send(body);

  let token:string|undefined;
  let items:any = [];
  let goodOffer;
  
  beforeEach(async () => {
    const toSave = [
      new Product({
        title: 'P2',
        img: 'test.png',
        description: 'D1',
        price: '0.02'
      }),
      new Product({
        title: 'P2',
        img: 'test.png',
        description: 'D2',
        price: '19.99'
      }),
      new Admin({
        username: 'admin',
        password: '$2b$15$pzOZ8lWcsbaVpbLR3ojYYejZ8cNqZ8ee1DTJwmXWG/bCMdLg7zpPe', //1234567890
        email: 'a@vp.pl'
      })
    ];

    toSave.forEach(async (item) => items.push(await item.save()));

    goodOffer = {
      items: [items[0]._id, items[1]._id],
      price: 11.99,
      expires: new Date()
    };

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
        .put('/api/dashboard/add-offer')
        .body(goodOffer);
    
    expect(res.status).toBe(401);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when token is not valid', async () => {
    const res = await exec('1', goodOffer);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when token does not store valid admin _id', async () => {
    const res = await exec('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2OTIzOTM1MzEsImV4cCI6MTY5MjM5NzEzMX0.BiykhELT1JaWUL0Rg0qfO8YLRfQ8SfmpLinPxz4qtI8', goodOffer);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when items are not provided', async () => {
    const offer = _.omit(goodOffer, 'items');
    const res = await exec(token, offer);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when item is not a valid mongoose id', async () => {
    const offer = { ...goodOffer };
    offer.items[0] = '1';
    const res = await exec(token, offer);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when item is not in database', async () => {
    const offer = { ...goodOffer };
    offer.items[0] = new Types.ObjectId();
    const res = await exec(token, offer);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when there are more than 3 items', async () => {
    const products = [
      new Product({
        title: 'P3',
        img: 'test.png',
        description: 'D3',
        price: '19.99'
      }),
      new Product({
        title: 'P4',
        img: 'test.png',
        description: 'D4',
        price: '19.99'
      }),
    ];

    let savedProducts:any = [];

    products.forEach(async (p) => savedProducts.push(await p.save()));

    const offer = { ...goodOffer };
    offer.items.push([...savedProducts]);
    const res = await exec(token, offer);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when expires is not set', async () => {
    const offer = _.omit(goodOffer, 'expires');
    const res = await exec(token, offer);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when expires is not a valid date', async () => {
    const offer = { ...goodOffer };
    offer.expires = 'invalid date';
    const res = await exec(token, offer);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when expires is an expired date', async () => {
    const offer = { ...goodOffer };
    offer.expires = new Date('2000-12-12');
    const res = await exec(token, offer);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when price is not provided', async () => {
    const offer = _.omit(goodOffer, 'price');
    const res = await exec(token, offer);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when price is not a number', async () => {
    const offer = { ...goodOffer };
    offer.price = 'invalid price';
    const res = await exec(token, offer);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when too low price given', async () => {
    const offer = { ...goodOffer };
    offer.price = 0.001;
    const res = await exec(token, offer);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when too high price given', async () => {
    const offer = { ...goodOffer };
    offer.price = 9999999.01;
    const res = await exec(token, offer);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 when one item given', async () => {
    const offer = { ...goodOffer };
    delete offer.items[1];
    const res = await exec(token, offer);
    
    expect(res.status).toBe(200);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 200 when more items given', async () => {
    const res = await exec(token, goodOffer);
    
    expect(res.status).toBe(200);
    expect(res.body.msg).toBeDefined();
  });
});
