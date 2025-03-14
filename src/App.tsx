import { useEffect, useState } from "react";
import "./App.css";
import CurrencyConversionCalculation from "./components/CurrencyConversionCalculation";
import CurrencyListManagement from "./components/CurrencyListManagement";
import { ExchangeRate } from "./types";
const LOCAL_STORAGE_KEY = "currency_rates";

function App() {
  const [rates, setRates] = useState<ExchangeRate[]>(() => {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return localData ? JSON.parse(localData) : [];
  });

  const handleAddRate = (rate: ExchangeRate) => {
    setRates((prev) => [...prev, rate]);
  };

  const handleDeleteRate = (id: string) => {
    setRates(rates.filter((rate) => rate.id !== id));
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rates));
  }, [rates]);

  return (
    <div className="app">
      <div className="container max-w-5xl mx-auto p-4">
        <header className="prose mb-8">
          <h1>Interview Test</h1>
        </header>
        <main>
          <div className="grid  grid-cols-2 gap-6">
            <div className="col-span-1">
              <CurrencyListManagement
                rates={rates}
                onDeleteRate={handleDeleteRate}
                onAddRate={handleAddRate}
              />
            </div>
            <div className="col-span-1">
              <CurrencyConversionCalculation rates={rates} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
