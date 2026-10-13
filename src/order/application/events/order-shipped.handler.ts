import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderShippedEvent } from '../../domain/events/order-shipped.event.js';
import {
  NOTIFICATION_SERVICE,
  type NotificationPort,
} from '../../../customers/application/port/notification.port.js';
import { Inject } from '@nestjs/common';

@EventsHandler(OrderShippedEvent)
export class OrderShippedHandler implements IEventHandler<OrderShippedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderShippedEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Shipped',
      message: `Your Clean Shop order ${event.orderId} has been shipped. Your tracking number is ${event.trackingNumber}`,
    });
  }
}
