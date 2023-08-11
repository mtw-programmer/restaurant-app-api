import Product from '../../../models/Product';

export default async () => {
  await Product.deleteMany({});
};
