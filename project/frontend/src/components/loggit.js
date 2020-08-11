import React from "react"
import {Loader} from "semantic-ui-react"
import axios from "axios"
import cookie from "react-cookies"
import queryString from 'querystring'

class Loggit extends React.Component{
    constructor(props){
        super(props)
        
    }
    componentDidMount(){
        var val = queryString.parse(this.props.location.search.slice(1))
        if(val.code == null || val.code === "" || val.state !== cookie.load('statetoken')){
            window.location='/'
        }

        const config = {
            headers: { 'Content-Type': 'application/json' },
        }

        axios.post("/profile/token/", JSON.stringify({code: val.code}), config).then((request)=>{
            window.location='/mypage/home/'
        }).catch((error) => {
            window.location='/'
        })
    }


    render(){
        if(true){
            return(<Loader active size="massive" />)
        }
    }

}

export default Loggit