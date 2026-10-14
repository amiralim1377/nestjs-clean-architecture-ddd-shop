import { Module } from '@nestjs/common';
import { PAYMENT_REPOSITORY } from './application/port/payment.repository.port.js';
import { DrizzlePaymentRepository } from './infrastructure/adapters/drizzle-payment.repository.js';
import { PAYMENT_GATEWAY } from './port/payment-gateway.port.js';
import { StripePaymentAdapter } from './infrastructure/adapters/stripe-payment.adapter.js';
import { PaymentController } from './presentation/payment.controller.js';
import { ORDER_PRICING } from './application/port/order-pricing.port.js';
import { OrderPricingAdapter } from './infrastructure/adapters/order-pricing.adapter.js';

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
    {
      provide: ORDER_PRICING,
      useClass: OrderPricingAdapter,
    },
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
