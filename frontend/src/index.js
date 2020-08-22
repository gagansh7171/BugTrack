import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios'
import { Provider } from 'react-redux';
import store from './store/store'

import Home_page from './components/home_page'
import Mypage from './components/mypage'
import Loggit from './components/loggit'

axios.defaults.baseURL = 'http://localhost:8000/'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true



ReactDOM.render(
  <Provider store={store}>
    <Router>
          <Switch>
              {/* <Route exact path={"/login"} component={Login} /> */}
              <Route exact path={"/"} component={Home_page} />
              <Route path={"/mypage"} component={Mypage} />
              <Route path={"/loggit"} component={Loggit} />
          </Switch>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
