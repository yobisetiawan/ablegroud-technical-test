import { useRef } from "react";
import { ExchangeRate } from "../types";

interface Props {
  rates: ExchangeRate[];
  onAddRate: (rate: ExchangeRate) => void;
  onDeleteRate: (id: string) => void;
}

const CurrencyListManagement = ({ rates, onAddRate, onDeleteRate }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fromCurrency = formData.get("fromCurrency") as string;
    const toCurrency = formData.get("toCurrency") as string;
    const rate = parseFloat(formData.get("rate") as string);

    onAddRate({ id: crypto.randomUUID(), fromCurrency, toCurrency, rate });

    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <div className="card bg-base-100  shadow-sm">
      <div className="card-body">
        <h2 className="card-title mb-4">Currency List Management</h2>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 mb-5"
        >
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
              name="rate"
              step={"0.0001"}
              placeholder="Exchange Rate"
              className="input w-full"
              required
            />
          </div>
          <div className="col-span-2">
            <button type="submit" className="btn btn-primary block w-full">
              Add Rate
            </button>
          </div>
        </form>

        <div>
          {rates.length > 0 && (
            <h3 className="font-bold mb-4">Current Rates:</h3>
          )}

          <div className="max-h-[400px] overflow-y-auto ">
            <ul>
              {rates.map((rate) => (
                <li key={rate.id} className="flex items-center mb-2">
                  <span className="flex-1">
                    {rate.fromCurrency} to {rate.toCurrency} - {rate.rate}
                  </span>
                  <button
                    onClick={() => onDeleteRate(rate.id)}
                    className="btn btn-error text-white"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {rates.length === 0 && (
            <div className="border p-4 border-base-200 rounded ">No Data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyListManagement;
