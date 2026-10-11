import { Module } from '@nestjs/common';
import { ProductsController } from './presentation/product.controller.js';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [ProductsController],
})
export class ProductModule {}
