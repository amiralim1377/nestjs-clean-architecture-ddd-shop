import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from './application/port/order.repository.port.js';
import { DrizzleOrderRepository } from './infrastructure/adapters/drizzle-order.repository.js';
import { OrderController } from './presentation/order.controller.js';
import { CommandHandlers } from './application/use-cases/index.js';

@Module({
  imports: [],
  providers: [
    ...CommandHandlers,
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
  ],
  controllers: [OrderController],
})
export class OrderModule {}
