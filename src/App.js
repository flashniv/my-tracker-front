import './App.css';
import Login from "./pages/login/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";

function App() {
    let theme=createTheme({
        palette: {
            primary: {
                main: '#005600',
            },
            secondary: {
                main: '#560032',
            },
            background: {
                default: '#fff',
            },
            text: {
                primary: '#fff',
            }
        },
    })
    /*let theme=createTheme({

    })*/
    console.log(theme)
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
