import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  PAYMENT_GATEWAY,
  type PaymentGatewayPort,
} from '../port/payment-gateway.port.js';
import { CreatePaymentDto } from './dtos/create-payment.dto.js';
import { CreatePaymentCommand } from '../application/use-cases/create-payment/create-payment.command.js';

@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly commandBus: CommandBus,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGatewayPort,
  ) {}

  @Post()
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.commandBus.execute(
      new CreatePaymentCommand(dto.orderId, dto.successUrl, dto.cancelUrl),
    );
  }
}
