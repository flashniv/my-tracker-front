import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import { LoginContext } from './common/LoginContext';
import API from './common/API';
import LogIn from './pages/login/LogIn';
import Site from './pages/site/Site';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(()=>{
    API.getContent("/api/v1/login")
    .then(response=>{
      setLoggedIn(true);
    })
    .catch(error =>{
      //console.error(error);
    });
  },[]);

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
      <LoginContext value={{loggedIn,setLoggedIn}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Site />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </LoginContext>
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
