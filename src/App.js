import './App.css';
import Login from "./pages/login/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";
import Dashboard from "./pages/dashboard/Dashboard";
import NavBar from "./components/NavBar/NavBar";
import {useState} from "react";
import Register from "./pages/register/Register";
import APIServer from "./API/APIServer";
import Organizations from "./pages/organizations/Organizations";
import Projects from "./pages/projects/Projects";
import Tasks from "./pages/tasks/Tasks";

function App() {
    const [login,setLogin]=useState(APIServer.isLoggedIn)

    const settingLogin=function (input){
        setLogin(input)
        APIServer.setLoggedIn(input)
    }

    let theme=createTheme({
        palette: {
            primary: {
                main: '#005600',
            },
            secondary: {
                main: '#560032',
            },
        },
    })
    /*let theme=createTheme({

    })*/
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <NavBar login={login} setLogin={settingLogin}/>
                <Routes>
                    <Route path="/" element={<Dashboard />}/>
                    <Route path="/login" element={<Login setLogin={settingLogin} />}/>
                    <Route path="/register" element={<Register setLogin={settingLogin} />}/>
                    <Route path="/projects">
                        <Route path=":orgId" element={<Projects />} />
                    </Route>
                    <Route path="/tasks">
                        <Route path=":projectId" element={<Tasks />} />
                    </Route>
                    <Route path="/organizations" element={<Organizations />}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
