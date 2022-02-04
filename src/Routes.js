
import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from './utils/history';
// import About from "./pages/About";
import Home from "./pages/MainPage";
import Navbar from './components/Navbar';
import About from "./pages/about";
import Mint from "./pages/mint";
// import ServiceAdminPage from "./pages/ServiceAdminPage";
// import ManageService from "./pages/ManageService";
// import ServeiceReceivers from "./pages/ServeiceReceivers";
// import UserPage from "./pages/UserPage"
// import PolicyManagement from "./pages/PolicyManagement";
// import AddPolicy from "./pages/AddPolicy";
// import AdminPage from "./pages/AdminPage";


export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Navbar/>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/mint" exact component={Mint} />
                    <Route path="/about" exact component={About} />
                </Switch>
            </Router>
        )
    }
}
