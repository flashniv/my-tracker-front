import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import Site from './pages/site/Site';
import { UserContext } from './common/UserContext';

function App() {
  const [userData, setUserData] = useState<UserAuth|null>(null);

  const theme = createTheme({
    components: {
      // Name of the component ⚛️
      MuiButtonBase: {
        defaultProps: {
          // The props to apply
          disableRipple: true, // No more ripple, on the whole application 💣!
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <UserContext value={userData}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Site />} />
          </Routes>
        </BrowserRouter>
      </UserContext>
    </ThemeProvider>
  );
}


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
