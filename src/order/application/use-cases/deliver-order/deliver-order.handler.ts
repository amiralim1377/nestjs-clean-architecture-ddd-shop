import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeliverOrderCommand } from './deliver-order.command.js';
import {
  ORDER_REPOSITORY,
  type OrderRepositoryPort,
} from '../../port/order.repository.port.js';
import { Inject } from '@nestjs/common';
import { OrderId } from '../../../domain/value-object/order-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@CommandHandler(DeliverOrderCommand)
export class DeliverOrderHandler implements ICommandHandler<
  DeliverOrderCommand,
  void
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeliverOrderCommand): Promise<void> {
    const order = await this.orderRepository.findById(
      new OrderId(command.orderId),
    );

    if (!order) {
      throw new ApplicationException(
        `Order with ID ${command.orderId} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    const tracked = this.eventPublisher.mergeObjectContext(order);
    tracked.deliver();
    await this.orderRepository.save(tracked);
    tracked.commit();
  }
}
