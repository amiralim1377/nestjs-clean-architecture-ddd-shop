import { CancelOrderHandler } from './cancel-order/cancel-order.command.js';
import { ConfirmOrderHandler } from './confirm-order/confirm-order.command.js';
import { DeliverOrderHandler } from './deliver-order/deliver-order.handler.js';
import { PlaceOrderHandler } from './place-order/place-order.handler.js';
import { ShipOrderHandler } from './ship-order/ship-order.command.js';

export const CommandHandlers = [
  PlaceOrderHandler,
  ConfirmOrderHandler,
  ShipOrderHandler,
  DeliverOrderHandler,
  CancelOrderHandler,
];
