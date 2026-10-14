import { Module } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from './application/port/payment.repository.port.js';
import { DrizzlePaymentRepository } from './infrastructure/adapters/drizzle-payment.repository.js';
import { PAYMENT_GATEWAY } from './port/payment-gateway.port.js';
import { StripePaymentAdapter } from './infrastructure/adapters/stripe-payment.adapter.js';
import { PaymentController } from './presentation/payment.controller.js';

@Module({
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: DrizzlePaymentRepository,
    },
    {
      provide: PAYMENT_GATEWAY,
      useClass: StripePaymentAdapter,
    },
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
