import { ConversionResult, ExchangeRate } from "../types";

export function findBestPath(rates: ExchangeRate[], fromCurrency: string, toCurrency: string): ConversionResult | null {
    const graph = new Map<string, Map<string, number>>();

    // Build the graph
    rates.forEach((rate) => {
        if (!graph.has(rate.fromCurrency)) {
            graph.set(rate.fromCurrency, new Map<string, number>());
        }
        if (!graph.has(rate.toCurrency)) {
            graph.set(rate.toCurrency, new Map<string, number>());
        }

        const fromMap = graph.get(rate.fromCurrency)!;
        const toMap = graph.get(rate.toCurrency);

        if (!fromMap || !toMap) { return; }

        const from = rate.fromCurrency;
        const to = rate.toCurrency;

        fromMap.set(to, rate.rate);
        toMap.set(from, 1 / rate.rate);

    });

    //initialize 
    const distances = new Map<string, number>();
    const previous = new Map<string, string>();
    const unvisited = new Set<string>();

    graph.forEach((_, currency) => {
        distances.set(currency, currency === fromCurrency ? 1 : 0);
        unvisited.add(currency);
    });

    // Dijkstra's algorithm
    while (unvisited.size > 0) {
        let current: string | null = null;
        let maxDistance = 0;

        unvisited.forEach((currency) => {
            if (distances.get(currency)! > maxDistance) {
                current = currency;
                maxDistance = distances.get(currency)!;
            }
        });

        if (!current) { break; }
        if (current === toCurrency) { break; }
        unvisited.delete(current);

        const neighbors = graph.get(current);
        if (!neighbors) { continue; }

        neighbors.forEach((rate, neighbor) => {
            if (!unvisited.has(neighbor)) { return; }

            const newDistance = distances.get(current!)! * rate;
            if (newDistance > distances.get(neighbor)!) {
                distances.set(neighbor, newDistance);
                previous.set(neighbor, current!);
            }
        });

    }

    const path: string[] = [];
    let current = toCurrency;
    while (current) {
        path.unshift(current);
        const prev = previous.get(current);
        if (!prev) { break; }
        current = prev;
        if (current === fromCurrency) {
            path.unshift(current);
            break;
        }
    }

    if (path.length < 2 || path[0] !== fromCurrency || path[path.length - 1] !== toCurrency) {
        return null;
    }

    const calculation: string[] = [];
    let effectiveRate = 1;


    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const fromNeighbors = graph.get(from);
        if (!fromNeighbors) { continue; }
        const rate = fromNeighbors.get(to);
        if (!rate) { continue; }
        effectiveRate *= rate;
        calculation.push(`${from} -> ${to}: ${rate}`);
    }

    return {
        path,
        effectiveRate,
        calculation,
    };
}