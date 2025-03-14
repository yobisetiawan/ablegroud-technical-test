export interface ExchangeRate {
    id: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
}

export interface ConversionResult {
    path: string[];
    effectiveRate: number;
    calculation: string[];
}