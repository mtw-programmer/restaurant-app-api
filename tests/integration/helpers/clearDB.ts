import Product from '../../../models/Product';
import Offer from '../../../models/Offer';

export default async () => {
  await Product.deleteMany({});
  await Offer.deleteMany({});
};
