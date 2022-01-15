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
import IndexPage from "./pages/index/IndexPage";

function App() {
    const [login,setLogin]=useState(APIServer.isLoggedIn)
    const [title,setTitle]=useState("My task tracker")

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
    //console.log(theme)
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <NavBar login={login} title={title} setLogin={settingLogin}/>
                <Routes>
                    <Route path="/" element={<IndexPage />}/>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login setLogin={settingLogin} />}/>
                    <Route path="/register" element={<Register setLogin={settingLogin} />}/>
                    <Route path="/projects">
                        <Route path=":orgId" element={<Projects setTitle={setTitle}/>} />
                    </Route>
                    <Route path="/tasks">
                        <Route path=":projectId" element={<Tasks setTitle={setTitle} />} />
                    </Route>
                    <Route path="/organizations" element={<Organizations setTitle={setTitle} />}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
