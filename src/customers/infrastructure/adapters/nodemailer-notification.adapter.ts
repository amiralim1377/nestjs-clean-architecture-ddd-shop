import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import type {
  Notification,
  NotificationPort,
} from '../../application/port/notification.port.js';

import {
  CUSTOMER_REPOSITORY,
  type CustomerRepositoryPort,
} from '../../application/port/customer.repository.port.js';

import { CustomerId } from '../../domain/value-object/customer-id.vo.js';
import { ApplicationException } from '../../../shared/domain/exceptions/application.exception.js';

@Injectable()
export class NodemailerEmailAdapter implements NotificationPort {
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;
  private readonly logger = new Logger(NodemailerEmailAdapter.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.getOrThrow<number>('SMTP_PORT'),
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'),
      },
    });

    this.from = this.configService.getOrThrow<string>('SMTP_FROM');
  }

  async sendNotification(notification: Notification): Promise<void> {
    const customer = await this.customerRepository.findById(
      new CustomerId(notification.recipientId),
    );

    if (!customer) {
      throw new ApplicationException(
        `User not found by ${notification.recipientId}`,
      );
    }

    await this.transporter.sendMail({
      from: this.from,
      to: customer.getEmail().getValue(),
      subject: notification.subject,
      html: notification.message,
    });

    this.logger.log(`Email sent to ${customer.getEmail().getValue()}`);
  }
}
