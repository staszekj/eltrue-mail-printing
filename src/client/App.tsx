import React, { createContext } from 'react';
import './App.css';
import { MuiThemeProvider, StylesProvider } from "@material-ui/core";
import { TPrintedMailsApi, usePrintedMails } from "./hooks/printed-mails-hook";
import { theme } from "./theme";
import { AppRoutes } from "./routes";


export type TAppContext = {
  printedMails: TPrintedMailsApi
};
export const AppContext = createContext<TAppContext | null>(null);

export function App() {

  const appContextValue: TAppContext = {
    printedMails: usePrintedMails()
  };

  return (
    <div className="App">
      <AppContext.Provider value={appContextValue}>
        <StylesProvider injectFirst>
          <MuiThemeProvider theme={theme}>
            <AppRoutes />
          </MuiThemeProvider>
        </StylesProvider>
      </AppContext.Provider>
    </div>
  );
}

export default App;
