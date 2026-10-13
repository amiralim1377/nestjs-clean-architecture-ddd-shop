import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderQuery } from '../get-order.query.js';
import { Order } from '../../../domain/entity/order.entity.js';
import { Inject } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  type OrderRepositoryPort,
} from '../../port/order.repository.port.js';
import { OrderId } from '../../../domain/value-object/order-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery, Order> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(query: GetOrderQuery): Promise<Order> {
    const order = await this.orderRepository.findById(new OrderId(query.id));

    if (!order) {
      throw new ApplicationException(
        `Order with ID ${query.id} not found`,
        ApplicationExceptionCode.NOT_FOUND,
      );
    }

    return order;
  }
}
