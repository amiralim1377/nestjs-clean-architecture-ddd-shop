import { Module } from '@nestjs/common';
import { ProductsController } from './presentation/product.controller.js';
import { CqrsModule } from '@nestjs/cqrs';
import { PRODUCT_REPOSITORY } from './application/port/product.repository.port.js';
import { DrizzleProductRepository } from './infrastructure/adapters/drizzle-product.repository.js';
import { CommandHandler } from './application/index.js';
import { QueryHandlers } from './application/queries/handlers/index.js';
import { ConfigService } from '@nestjs/config';
import { MongoProductRepository } from './infrastructure/adapters/mongo-product.repository.js';

@Module({
  imports: [CqrsModule],
  providers: [
    ...CommandHandler,
    ...QueryHandlers,
    DrizzleProductRepository,
    MongoProductRepository,
    {
      provide: PRODUCT_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        mongoRepo: MongoProductRepository,
        drizzleRepo: DrizzleProductRepository,
      ) => {
        return configService.get('DATABASE') === 'mongodb'
          ? mongoRepo
          : drizzleRepo;
      },
      inject: [ConfigService, MongoProductRepository, DrizzleProductRepository],
    },
  ],
  controllers: [ProductsController],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductModule {}
