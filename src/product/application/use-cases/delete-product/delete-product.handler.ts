import {
  CommandHandler,
  ICommandHandler,
  IQueryHandler,
  QueryHandler,
} from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command.js';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from '../../port/product.repository.port.js';
import { ProductId } from '../../../domain/value-objects/product-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';
import { Inject } from '@nestjs/common';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<
  DeleteProductCommand,
  void
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const productId = new ProductId(command.id);
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ApplicationException(
        `Product with ID ${command.id} was not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    await this.productRepository.delete(productId);
  }
}
