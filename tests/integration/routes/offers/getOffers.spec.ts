import request from 'supertest';
import mongoose from 'mongoose';
import server from '../../../../index';
import Product from '../../../../models/Product';
import Offer from '../../../../models/Offer';
import clearDB from '../../helpers/clearDB';

describe('GET /api/get-special-offers', () => {
  const exec = async () => request(server).get('/api/get-special-offers').send();

  let productsId:any = [];
  const products = [
    {
      title: 'P1',
      img: 'test.png',
      description: 'D1',
      price: 0.02
    },
    {
      title: 'P2',
      img: 'test2.png',
      description: 'D2',
      price: 21
    }
  ];
  
  beforeEach(async () => {
    clearDB();

    const p = new Product(products[0]);
    const result1 = await p.save();
    productsId.push(result1._id);
    
    const p2 = new Product(products[1]);
    const result2 = await p2.save();
    productsId.push(result2._id);

    const offers = [
      {
        items: [productsId[0], productsId[1]],
        price: 13.30,
        expires: new Date('2023-08-13T13:40:50').toISOString()
      },
      {
        items: [productsId[1]],
        price: 0.01,
        expires: new Date('2023-08-12T00:00:00').toISOString()
      }
    ];

    const o1 = new Offer(offers[0]);
    await o1.save();
    
    const o2 = new Offer(offers[1]);
    await o2.save();
  });

  afterEach(() => {
    clearDB();
    productsId = [];
  });
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it('should return all offers (without __v property and with createdAt property)', async () => {
    const res = await exec();

    const [offer1, offer2] = res.body.offers;

    expect(offer1).toMatchObject(
      {
        items: [products[0], products[1]],
        price: 13.30,
        expires: new Date('2023-08-13T13:40:50').toISOString()
      }
    );

    expect(offer2).toMatchObject(
      {
        items: [products[1]],
        price: 0.01,
        expires: new Date('2023-08-12T00:00:00').toISOString()
      }
    );

    expect(res.body.offers[0].__v).not.toBeDefined();
    expect(res.body.offers[1].__v).not.toBeDefined();
    
    expect(res.body.offers[0].createdAt).toBeDefined();
    expect(res.body.offers[1].createdAt).toBeDefined();
  });

  it('should return an empty array when no offers in db', async () => {
    clearDB();
    const res = await exec();
    expect(res.body.offers.length).toBe(0);
  });
});
