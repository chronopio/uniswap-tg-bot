import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { TelegrafModule } from "nestjs-telegraf";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProviderModule } from "./blockchain/provider/provider.module";
import { WalletModule } from "./blockchain/wallet/wallet.module";
import { BotModule } from "./bot/bot.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>("TELEGRAM_TOKEN"),
      }),
      inject: [ConfigService],
    }),
    BotModule,
    WalletModule,
    ProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
