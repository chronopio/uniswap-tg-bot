import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Currencies, TokenSymbolToIds } from "./coingecko.constants";

@Injectable()
export class CoingeckoService {
  constructor(private readonly configService: ConfigService) {}

  getTokens(): string[] {
    return Object.keys(TokenSymbolToIds);
  }

  getCurrencies(): string[] {
    return [...Currencies];
  }

  async getPairPrice(token: string, currency: string): Promise<number> {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${TokenSymbolToIds[token]}&vs_currencies=${currency}`,
      {
        headers: {
          Accept: "application/json",
          "x-cg-demo-api-key": this.configService.get<string>("COINGECKO_API_KEY"),
        },
      },
    );

    const price = response.data[TokenSymbolToIds[token]][currency.toLowerCase()];

    if (!price) {
      throw new Error(`Price not found for ${token}-${currency}`);
    }

    return price;
  }
}
