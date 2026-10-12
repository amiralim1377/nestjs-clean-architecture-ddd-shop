import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { CreateProductCommand } from './create-product.command.js';
import { PRODUCT_REPOSITORY } from '../../port/product.repository.port.js';
import type { ProductRepository } from '../../port/product.repository.port.js';
import { Sku } from '../../../domain/value-objects/sku.vo.js';
import { Product } from '../../../domain/entities/product.entity.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exeotions/application.exception.js';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<
  CreateProductCommand,
  void
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const sku = Sku.create(command.sku);

    const existingBySku = await this.productRepository.findBySku(sku);

    if (existingBySku) {
      throw new ApplicationException(
        `Product with SKU ${command.sku} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const existingByName = await this.productRepository.findByName(
      command.name,
    );

    if (existingByName) {
      throw new ApplicationException(
        `Product with name ${command.name} already exists`,
        ApplicationExceptionCode.CONFLICT,
      );
    }

    const product = Product.create(
      command.name,
      command.description,
      command.sku,
      command.price,
      command.currency,
      command.stock,
    );

    await this.productRepository.save(product);
  }
}
