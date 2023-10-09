import request from 'supertest';
import _ from 'lodash';
import server from '../../../../index';
import Product from '../../../../models/Product';
import Admin from '../../../../models/Admin';
import clearDB from '../../helpers/clearDB';

describe('PUT /api/dashboard/add-product', () => {
  beforeAll(() => clearDB());

  const exec = async (token:any, body:any) => 
    request(server)
      .put('/api/dashboard/add-product')
      .set('x-auth-token', token)
      .attach('img', body.img)
      .send(body);

  const goodProduct = {
    title: 'P2',
    img: '../../helpers/media/test.png',
    description: 'D2',
    price: 11.99
  };

  let token:string|undefined;
  
  beforeEach(async () => {
    const toSave = [
      new Product({
        title: 'P1',
        img: 'test.png',
        description: 'D1',
        price: 0.02
      }),
      new Admin({
        username: 'admin',
        password: '$2b$15$pzOZ8lWcsbaVpbLR3ojYYejZ8cNqZ8ee1DTJwmXWG/bCMdLg7zpPe', //1234567890
        email: 'a@vp.pl'
      })
    ];

    toSave.forEach(async (item) => await item.save());

    const res = await request(server).post('/api/authentication').send({ username: 'admin', password: '1234567890' });
    token = res.header['x-auth-token'];
  });

  afterEach(() => clearDB());
  afterAll(() => {
    server.close();
  });

  it('should return 401 when no token provided', async () => {
    const res = await request(server).post('/api/verify-token').send();
    expect(res.status).toBe(401);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 401 when token is not a string type', async () => {
    const res = await exec({}, goodProduct);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 401 when token is not valid', async () => {
    const res = await exec('1', goodProduct);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when token does not store valid admin _id', async () => {
    const res = await exec('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE2OTIzOTM1MzEsImV4cCI6MTY5MjM5NzEzMX0.BiykhELT1JaWUL0Rg0qfO8YLRfQ8SfmpLinPxz4qtI8', goodProduct);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when title is not provided', async () => {
    const product = _.omit('title', goodProduct);
    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when img is not provided', async () => {
    const product = _.omit('img', goodProduct);
    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when description is not provided', async () => {
    const product = _.omit('description', goodProduct);
    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when price is not provided', async () => {
    const product = _.omit('price', goodProduct);
    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when title is not a string type', async () => {
    const product:any = goodProduct;
    product.title = {};

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when title is less than 1 char long', async () => {
    const product:any = goodProduct;
    product.title = '';

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when title is longer than 30 chars long', async () => {
    const product:any = goodProduct;
    product.title = Array(32).join('a');

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when img is not a string type', async () => {
    const product:any = goodProduct;
    product.img = {};

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when img is not a valid path', async () => {
    const product:any = goodProduct;
    product.img = '../test.jpg';

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when img does not have an accepted extension (.jpg, .png, .gif)', async () => {
    const product:any = goodProduct;
    product.img = '../../helpers/media/test.txt';

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when img is heavier than 7MB', async () => {
    const product:any = goodProduct;
    product.img = '../../helpers/media/big.jpg';

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when img is not a string type', async () => {
    const product:any = goodProduct;
    product.img = {};

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });
  
  it('should return 400 when description is not a string type', async () => {
    const product:any = goodProduct;
    product.description = {};

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when description is less than 1 char long', async () => {
    const product:any = goodProduct;
    product.description = '';

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when description is longer than 1024 chars long', async () => {
    const product:any = goodProduct;
    product.title = Array(1026).join('a');

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when price is not a number type', async () => {
    const product:any = goodProduct;
    product.price = 'test';

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when price is less than 0.01', async () => {
    const product:any = goodProduct;
    product.price = 0.001;

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 400 when price is more than 9999999', async () => {
    const product:any = goodProduct;
    product.price = 9999999.01;

    const res = await exec(token, product);
    
    expect(res.status).toBe(400);
    expect(res.body.msg).toBeDefined();
  });

  it('should return 200 and add the product when everything is okay', async () => {
    const res = await exec(token, goodProduct);

    expect(res.status).toBe(200);
    expect(res.body.msg).toBeDefined();

    const product = await Product.findOne({ title: 'P2' });

    expect(product).toMatchObject(goodProduct);
    expect(product._id).toBeDefined();
    expect(product.createdAt).toBeDefined();
  });
});
