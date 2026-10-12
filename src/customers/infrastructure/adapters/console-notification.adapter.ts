import { Inject, Injectable, Logger } from '@nestjs/common';
import type {
  Notification,
  NotificationPort,
} from '../../application/port/notification.port.js';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../application/port/customer.repository.port.js';
import { CustomerId } from '../../domain/value-object/customer-id.vo.js';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(ConsoleNotificationAdapter.name);

  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async sendNotification(notification: Notification): Promise<void> {
    const customer = await this.customerRepository.findById(
      new CustomerId(notification.recipientId),
    );

    const recipient =
      customer?.getEmail().getValue() ?? notification.recipientId;

    this.logger.log(
      `[${notification.subject}] To: ${recipient} | ${notification.message}`,
    );
  }
}
