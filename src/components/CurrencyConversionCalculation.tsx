import { useState } from "react";
import { ConversionResult, ExchangeRate } from "../types";
import { findBestPath } from "../utils/converter";

interface Props {
  rates: ExchangeRate[];
}

const CurrencyConversionCalculation = ({ rates }: Props) => {
  const [resultTotal, setResultTotal] = useState("");
  const [result, setResult] = useState<ConversionResult | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fromCurrency = formData.get("fromCurrency") as string;
    const toCurrency = formData.get("toCurrency") as string;
    const amount = parseFloat(formData.get("amount") as string);

    const findResult = findBestPath(rates, fromCurrency, toCurrency);

    setResult(findResult);

    setResultTotal(
      `${amount} ${fromCurrency} = ${
        amount * findResult!.effectiveRate
      } ${toCurrency}`
    );
  };

  return (
    <div className="card bg-base-100  shadow-sm">
      <div className="card-body">
        <h2 className="card-title mb-4">Currency Conversion Calculation</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-5">
          <input
            type="text"
            placeholder="From Currency Code"
            className="input"
            maxLength={3}
            name="fromCurrency"
            required
          />
          <input
            type="text"
            placeholder="To Currency Code"
            className="input"
            maxLength={3}
            name="toCurrency"
            required
          />
          <div className="col-span-2">
            <input
              type="number"
              name="amount"
              step={"0.0001"}
              placeholder="Amount"
              className="input w-full"
              required
            />
          </div>
          <div className="col-span-2">
            <button type="submit" className="btn btn-primary block w-full">
              Convert
            </button>
          </div>
        </form>

        {result ? (
          <div>
            <h3 className="font-bold mb-3">Best Path:</h3>
            <div className="border p-4 border-base-200 rounded ">
              <p className="mb-3">
                Path:{" "}
                <strong className="text-primary">
                  {result.path.join(" -> ")}
                </strong>
              </p>
              <p>Effective Rate: {result.effectiveRate}</p>
              <p>Steps:</p>
              <ul className="list-disc pl-6">
                {result.calculation.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
              <div className="pt-4 text-primary font-bold">{resultTotal}</div>
            </div>
          </div>
        ) : (
          <div className="border p-4 border-base-200 rounded ">No result</div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConversionCalculation;
