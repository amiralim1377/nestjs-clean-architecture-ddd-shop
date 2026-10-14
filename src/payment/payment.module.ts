import { Module } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from './application/port/payment.repository.port.js';
import { DrizzlePaymentRepository } from './infrastructure/adapters/drizzle-payment.repository.js';

@Module({
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
  ],
})
export class PaymentModule {}
