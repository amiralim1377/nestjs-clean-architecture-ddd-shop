import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { PaymentCompletedEvent } from '../../../payment/events/payment-completed.event.js';
import { ConfirmOrderCommand } from '../use-cases/confirm-order/confirm-order.command.js';

@Injectable()
export class OrderFulfillmentSaga {
  @Saga()
  paymentCompleted = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(PaymentCompletedEvent),
      map((event) => new ConfirmOrderCommand(event.orderId)),
    );
  };
}
