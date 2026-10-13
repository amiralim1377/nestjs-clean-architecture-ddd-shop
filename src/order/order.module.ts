import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from './application/port/order.repository.port.js';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository.js';
import { OrderController } from './presentation/order.controller.js';
import { CommandHandlers } from './application/use-cases/index.js';
import { CUSTOMER } from './application/port/customer.port.js';
import { CustomerAdapter } from './infrastructure/adapters/customer.adapter.js';
import { PRODUCT } from './application/port/product.port.js';
import { ProductAdapter } from './infrastructure/adapters/product.adapter.js';
import { QueryHandlers } from './application/queries/handlers/index.js';
import { EventHandlers } from './application/events/index.js';

@Module({
  imports: [],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
    {
      provide: CUSTOMER,
      useClass: CustomerAdapter,
    },
    {
      provide: PRODUCT,
      useClass: ProductAdapter,
    },
  ],
  controllers: [OrderController],
})
export class OrderModule {}
