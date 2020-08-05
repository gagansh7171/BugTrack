import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import Home from './extras/mypagedetail'
import Navbar from './extras/navbar'

class Mypage extends React.Component{
    constructor(props){

        super(props)
    }
    render(){
        return(
            <div>
                <Navbar />
                
                <Router>
                    <Switch>

                        <Route exact path={"/mypage/home"} render={ () => <Home item='item1'/>} />
                        <Route exact path={"/mypage/plus"} render={ () => <Home item='item2'/>} />
                        <Route exact path={"/mypage/search"} render={ () => <Home item='item3'/>} />
                        <Route exact path={"/mypage/users"} render={ () => <Home item='item4'/>} />
                        <Route exact path={"/mypage/user"} render={ () => <Home item='item5'/>} />
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default Mypage