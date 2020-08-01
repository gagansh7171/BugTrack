import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';

import Home from './components/home';
// import Login from './components/login';

axios.defaults.baseURL = 'http://localhost:8000/'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true



ReactDOM.render(
  <Router>
        <Switch>
            {/* <Route exact path={"/login"} component={Login} /> */}
            <Route exact path={"/"} component={Home} />
        </Switch>
    </Router>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
