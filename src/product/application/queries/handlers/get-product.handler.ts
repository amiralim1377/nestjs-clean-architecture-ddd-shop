import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetProductQuery } from '../get-product.query.js';
import type { Product } from '../../../domain/entities/product.entity.js';

import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../port/product.repository.port.js';

import { ProductId } from '../../../domain/value-objects/product-id.vo.js';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<
  GetProductQuery,
  Product
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductQuery): Promise<Product> {
    const product = await this.productRepository.findById(
      new ProductId(query.id),
    );

    if (!product) {
      throw new NotFoundException(`Product with ID ${query.id} was not found`);
    }

    return product;
  }
}
