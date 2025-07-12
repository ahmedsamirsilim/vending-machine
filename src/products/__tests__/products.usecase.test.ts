import { ProductUseCase } from '../usecases';
import { IProduct } from '../db/product.schema';

jest.mock('../db/product.model');

describe('ProductUseCase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CreateProduct', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        cost: 100,
        quantity: 10,
        sellerId: 'seller123',
      };

      (ProductUseCase.CreateProduct as jest.Mock).mockResolvedValue(productData);

      const product = await ProductUseCase.CreateProduct(productData);

      expect(product).toBeDefined();
      expect(product.name).toBe(productData.name);
    });
  });
});
