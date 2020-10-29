import React, { FunctionComponent, useState, createContext, useCallback } from 'react';

interface TApiClientProviderProps {

}

interface TClientApi {
  data: { test: { id: string, value: number } }
  api: {
    fetchData: () => void
  }
}

export const useClientApi = (): TClientApi => {

  const [data, setData] = useState<TClientApi["data"]>({ test: { id: 'test', value: 10 } });

  const fetchData = async () => {
    const newValue = data.test.value + 100;
    setData({ test: { id: 'test', value: newValue } });

    await new Promise(resolve => setTimeout(resolve, 2000))

    setData((prev) => {
      const increasedValue = newValue + 5;
      if (increasedValue > prev['test'].value) {
        return { test: { id: 'test', value: increasedValue } }
      }
      return prev;
    })
  };

  return {
    data,
    api: {
      fetchData
    }
  }
};


export const clientApiProvider = createContext<TClientApi | null>(null);

export const ApiClientProvider: FunctionComponent<TApiClientProviderProps> = ({ children }) => {
  const clientApi = useClientApi();

  return (
    <clientApiProvider.Provider value={clientApi}>
      {children}
    </clientApiProvider.Provider>
  )
};
