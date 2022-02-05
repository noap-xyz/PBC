
import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";


import PoapBurnPage from "./pages/PoapBurnPage";
import Home from "./pages/MainPage";
import history from './utils/history';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/PoapBurnPage" component={PoapBurnPage} />
                </Switch>
            </Router>
        )
    }
}