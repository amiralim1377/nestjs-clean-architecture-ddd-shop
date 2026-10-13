import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderDeliveredEvent } from '../../domain/events/order-delivered.event.js';
import {
  NOTIFICATION_SERVICE,
  type NotificationPort,
} from '../../../customers/application/port/notification.port.js';
import { Inject } from '@nestjs/common';
import { OrderShippedEvent } from '../../domain/events/order-shipped.event.js';

@EventsHandler(OrderDeliveredEvent)
export class OrderDeliveredHandler implements IEventHandler<OrderDeliveredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderShippedEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Delivered',
      message: `Your Clean Shop order ${event.orderId} has been delivered.`,
    });
  }
}
