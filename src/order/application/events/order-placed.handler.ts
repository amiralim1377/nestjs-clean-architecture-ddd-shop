import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event.js';
import {
  NOTIFICATION_SERVICE,
  type NotificationPort,
} from '../../../customers/application/port/notification.port.js';
import { Inject } from '@nestjs/common';

@EventsHandler(OrderPlacedEvent)
export class OrderPlacedHandler implements IEventHandler<OrderPlacedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderPlacedEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Order Confirmation',
      message: `Your Clean Shop order ${event.orderId} has been confirmed. Thank you for your purchase!`,
    });
  }
}
