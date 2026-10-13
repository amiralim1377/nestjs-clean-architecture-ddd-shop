import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListOrdersQuery } from '../list-orders.query.js';
import { Order } from '../../../domain/entity/order.entity.js';
import { Inject } from '@nestjs/common';
import {
  ORDER_REPOSITORY,
  type OrderRepositoryPort,
} from '../../port/order.repository.port.js';

@QueryHandler(ListOrdersQuery)
export class ListOrdersHandler implements IQueryHandler<
  ListOrdersQuery,
  Order[]
> {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(query: ListOrdersQuery): Promise<Order[]> {
    if (query.customerId) {
      return this.orderRepository.findByCustomerId(query.customerId);
    }

    return this.orderRepository.findAll();
  }
}
