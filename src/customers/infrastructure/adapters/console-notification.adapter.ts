import { Injectable, Logger } from '@nestjs/common';
import type {
  Notification,
  NotificationPort,
} from '../../application/port/notification.port.js';

@Injectable()
export class ConsoleNotificationAdapter implements NotificationPort {
  private readonly logger = new Logger(ConsoleNotificationAdapter.name);

  async sendNotification(notification: Notification): Promise<void> {
    const recipient = notification.recipientId;

    this.logger.log(
      `[${notification.subject}] To: ${recipient} | ${notification.message}`,
    );
  }
}
