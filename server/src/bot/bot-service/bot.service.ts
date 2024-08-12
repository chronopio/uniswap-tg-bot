import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Context } from "telegraf";
import { SwiftSwapContext } from "../types";
import { replyMarkdownWallet } from "./utils/reply-markdown-wallet";

@Injectable()
export class BotService {
  constructor(private readonly configService: ConfigService) {}

  async start(ctx: SwiftSwapContext) {
    await ctx.reply("Welcome to SwiftSwap! Swapping made easy");

    await ctx.scene.enter("wallet");
  }

  async fetchTokenPrice(ctx: SwiftSwapContext) {
    await ctx.scene.enter("token-price");
  }

  async wallet(ctx: SwiftSwapContext) {
    await replyMarkdownWallet(ctx, ctx.session.wallet);
  }

  async faucet(ctx: Context) {
    await ctx.replyWithMarkdownV2(
      `[Here](${this.configService.get<string>("FAUCET_URL")}) you can find some Sepolia ETH for free`,
    );
  }

  async text(ctx: Context) {
    await ctx.reply("I'm not sure what you mean, sorry!");
  }

  async sticker(ctx: Context) {
    await ctx.replyWithSticker(this.configService.get<string>("REPLY_STICKER_ID"));
  }

  async help(ctx: Context) {
    ctx.replyWithMarkdownV2(`
      This is the list of available commands:
      
      • *Check token pair price:* /token
      • *Wallet information:* /wallet
      • *Link to a faucet:* /faucet
      • *List of commands:* /help 
  `);
  }
}
