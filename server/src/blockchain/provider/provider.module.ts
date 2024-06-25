import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}
