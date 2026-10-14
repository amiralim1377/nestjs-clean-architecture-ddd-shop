import { ConfirmPaymentHandler } from './confirm-payment/confirm-payment.handler.js';
import { CreatePaymentHandler } from './create-payment/create-payment.handler.js';

export const CommandHandlers = [CreatePaymentHandler, ConfirmPaymentHandler];
