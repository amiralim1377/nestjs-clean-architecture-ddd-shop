import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerRegisteredEvent } from './customer-registered.event.js';
import {
  NOTIFICATION_SERVICE,
  type NotificationPort,
} from '../application/port/notification.port.js';
import { Inject } from '@nestjs/common';

@EventsHandler(CustomerRegisteredEvent)
export class CustomerRegisteredHandler implements IEventHandler<CustomerRegisteredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: CustomerRegisteredEvent) {
    await this.notificationService.sendNotification({
      recipientId: event.customerId,
      subject: 'Welcome',
      message: `Welcome to Clean Shop, ${event.firstName}! Your account has been created.`,
    });
  }
}
