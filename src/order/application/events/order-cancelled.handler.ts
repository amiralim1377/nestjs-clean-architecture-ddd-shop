import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderCancelledEvent } from '../../domain/events/order-cancelled.event.js';
import {
  NOTIFICATION_SERVICE,
  type NotificationPort,
} from '../../../customers/application/port/notification.port.js';

@EventsHandler(OrderCancelledEvent)
export class OrderCancelledHandler implements IEventHandler<OrderCancelledEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderCancelledEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Cancelled',
      message: `Your Clean Shop order ${event.orderId} has been cancelled.`,
    });
  }
}
