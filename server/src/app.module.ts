import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProviderModule } from './blockchain/provider/provider.module';
import { WalletModule } from './blockchain/wallet/wallet.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [ConfigModule.forRoot(), BotModule, WalletModule, ProviderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
