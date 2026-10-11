import { Module } from '@nestjs/common';
import { ProductsController } from './presentation/product.controller.js';
import { CqrsModule } from '@nestjs/cqrs';
import { PRODUCT_REPOSITORY } from './application/port/product.repository.port.js';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repository.js';

@Module({
  imports: [CqrsModule],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: DrizzleProductRepository,
    },
  ],
  controllers: [ProductsController],
})
export class ProductModule {}
