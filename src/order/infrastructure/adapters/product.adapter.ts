import { Inject, Injectable } from '@nestjs/common';
import { ProductPort } from '../../application/port/product.port.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../../product/application/port/product.repository.port.js';
import { ProductId } from '../../../product/domain/value-objects/product-id.vo.js';

@Injectable()
export class ProductAdapter implements ProductPort {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async exists(productId: string): Promise<boolean> {
    const product = await this.productRepository.findById(
      new ProductId(productId),
    );
    return product !== null;
  }
}
