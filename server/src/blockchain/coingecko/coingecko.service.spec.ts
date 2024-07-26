import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import axios from "axios";
import { CoingeckoService } from "./coingecko.service";

jest.mock("axios");

describe("CoingeckoService", () => {
  let service: CoingeckoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [CoingeckoService],
    }).compile();

    service = module.get<CoingeckoService>(CoingeckoService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Getters", () => {
    it("should return the list of tokens", () => {
      const tokens = service.getTokens();

      expect(tokens).toHaveLength(8);
      expect(tokens).toStrictEqual(["BTC", "ETH", "BNB", "UNI", "LINK", "LTC", "BCH", "DOT"]);
    });

    it("should return the list of currencies", () => {
      const currencies = service.getCurrencies();

      expect(currencies).toHaveLength(9);
      expect(currencies).toStrictEqual([
        "BTC",
        "ETH",
        "BNB",
        "LINK",
        "LTC",
        "BCH",
        "DOT",
        "USD",
        "EUR",
      ]);
    });
  });

  describe("Price fetching", () => {
    let mockedAxios: jest.Mocked<typeof axios>;

    beforeEach(async () => {
      mockedAxios = axios as jest.Mocked<typeof axios>;

      mockedAxios.get.mockResolvedValue({
        data: {
          bitcoin: {
            usd: 60000,
          },
        },
      });
    });

    it("should fetch the price of a token in a currency", async () => {
      const price = await service.getPairPrice("BTC", "USD");

      expect(price).toStrictEqual(60000);
    });
  });
});
