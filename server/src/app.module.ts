import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { WalletModule } from './blockchain/wallet/wallet.module';
import { ProviderModule } from './blockchain/provider/provider.module';

@Module({
  imports: [ConfigModule.forRoot(), BotModule, WalletModule, ProviderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
