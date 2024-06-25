import { Module } from '@nestjs/common';

import { WalletService } from './wallet.service';
import { ProviderModule } from '../provider/provider.module';

@Module({
  imports: [ProviderModule],
  providers: [WalletService],
})
export class WalletModule {}
