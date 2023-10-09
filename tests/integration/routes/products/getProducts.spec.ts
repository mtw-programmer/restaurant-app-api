import request from 'supertest';
import server from '../../../../index';
import Product from '../../../../models/Product';
import clearDB from '../../helpers/clearDB';

describe('GET /api/get-products', () => {
  beforeAll(() => clearDB());

  const exec = async () => request(server).get('/api/get-products').send();
  
  beforeEach(() => {
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

    products.forEach(async (product) => {
      const p = new Product(product);
      await p.save();
    })
  });

  afterEach(() => clearDB());
  afterAll(() => {
    server.close();
  });

  it('should return all products (without __v property and with createdAt property)', async () => {
    const res = await exec();
    expect(res.body.products[0]).toMatchObject(
      {
        title: 'P1',
        img: 'test.png',
        description: 'D1',
        price: 0.02
      }
    );
    expect(res.body.products[1]).toMatchObject(
      {
        title: 'P2',
        img: 'test2.png',
        description: 'D2',
        price: 21
      }
    );

    expect(res.body.products[0].__v).not.toBeDefined();
    expect(res.body.products[1].__v).not.toBeDefined();
    
    expect(res.body.products[0].createdAt).toBeDefined();
    expect(res.body.products[1].createdAt).toBeDefined();
  });

  it('should return an empty array when no products in db', async () => {
    clearDB();
    const res = await exec();
    expect(res.body.products.length).toBe(0);
  });
});
