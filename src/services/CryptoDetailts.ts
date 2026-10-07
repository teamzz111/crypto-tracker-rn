import {ICryptoDetails} from '../types/crypto';
import {ExchangeRate} from './ExchangeService';

export class CryptoDetails extends ExchangeRate {
  public readonly rank: number;
  public readonly priceBTC: number;
  public readonly marketCapUSD: number;
  public readonly circulatingSupply: number;
  public readonly totalSupply: number;
  public readonly maxSupply: number;

  constructor(data: ICryptoDetails) {
    super(data);
    this.rank = data.rank;
    this.priceBTC = parseFloat(data.price_btc);
    this.marketCapUSD = parseFloat(data.market_cap_usd);
    this.circulatingSupply = parseFloat(data.csupply);
    this.totalSupply = parseFloat(data.tsupply);
    this.maxSupply = parseFloat(data.msupply);
  }

  public formatMarketCap(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(this.marketCapUSD);
  }

  public formatSupply(supply: number): string {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(supply);
  }

  public getCirculatingSupply(): string {
    return this.formatSupply(this.circulatingSupply);
  }

  public getTotalSupply(): string {
    return this.formatSupply(this.totalSupply);
  }

  public getMaxSupply(): string {
    return this.maxSupply ? this.formatSupply(this.maxSupply) : 'Unlimited';
  }

  public getSupplyPercentage(): number {
    if (!this.maxSupply) {
      return 100;
    }
    return (this.circulatingSupply / this.maxSupply) * 100;
  }
}
