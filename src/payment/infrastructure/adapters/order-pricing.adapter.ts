import { Inject, Injectable } from '@nestjs/common';
import {
  OrderPricing,
  OrderPricingPort,
  PricingLine,
} from '../../application/port/order-pricing.port.js';
import {
  ORDER_REPOSITORY,
  type OrderRepositoryPort,
} from '../../../order/application/port/order.repository.port.js';
import { OrderId } from '../../../order/domain/value-object/order-id.vo.js';
import { OrderItem } from '../../../order/domain/entity/order-item.entity.js';

@Injectable()
export class OrderPricingAdapter implements OrderPricingPort {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async getOrderPricing(orderId: string): Promise<OrderPricing | null> {
    const order = await this.orderRepository.findById(new OrderId(orderId));
    if (!order) {
      return null;
    }

    return {
      total: order.getTotal(),
      lines: order.items.map((item) => this.toPricingLine(item)),
    };
  }

  private toPricingLine(item: OrderItem): PricingLine {
    return {
      name: item.productName,
      quantity: item.quantity,
      unitAmount: item.getEffectiveUnitPrice(),
    };
  }
}
