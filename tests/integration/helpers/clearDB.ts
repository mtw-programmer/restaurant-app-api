import Product from '../../../models/Product';
import Offer from '../../../models/Offer';
import Admin from '../../../models/Admin';

export default async () => {
  await Product.deleteMany({});
  await Offer.deleteMany({});
  await Admin.deleteMany({});
};
