import { Injectable, UseInterceptors } from "@nestjs/common";
import { Command, Ctx, Help, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { BotService } from "./bot-service/bot.service";
import { CheckWalletInterceptor } from "./interceptors/check-wallet.interceptor";
import { SwiftSwapContext } from "./types";

// Update decorator acts as a controller for handling incoming messages
@Update()
@Injectable()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx: SwiftSwapContext) {
    await this.botService.start(ctx);
  }

  @Command("token")
  async fetchTokenPrice(@Ctx() ctx: SwiftSwapContext) {
    await this.botService.fetchTokenPrice(ctx);
  }

  @Command("wallet")
  @UseInterceptors(CheckWalletInterceptor)
  async wallet(@Ctx() ctx: SwiftSwapContext) {
    await this.botService.wallet(ctx);
  }

  @Command("faucet")
  async faucet(@Ctx() ctx: Context) {
    await this.botService.faucet(ctx);
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await this.botService.help(ctx);
  }

  @On("text")
  async text(@Ctx() ctx: Context) {
    await this.botService.text(ctx);
  }

  @On("sticker")
  async sticker(@Ctx() ctx: Context) {
    await this.botService.sticker(ctx);
  }
}
