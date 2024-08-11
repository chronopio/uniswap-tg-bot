import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, of } from "rxjs";
import { Context } from "telegraf";

@Injectable()
export class CheckWalletInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Context> {
    const [ctx] = context.getArgs();
    const { wallet } = ctx.session;

    if (!wallet) {
      ctx.reply("Wallet not found in session, please create or import a wallet first with /start");
      return of(null);
    }

    return next.handle();
  }
}
