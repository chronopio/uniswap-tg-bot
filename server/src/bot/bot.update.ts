import { Injectable } from "@nestjs/common";
import { Command, Ctx, Help, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { SceneContext } from "telegraf/typings/scenes";
import { BotService } from "./bot-service/bot.service";

// Update decorator acts as a controller for handling incoming messages
@Update()
@Injectable()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx: SceneContext) {
    await this.botService.start(ctx);
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
