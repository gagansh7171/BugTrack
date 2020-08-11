import React from 'react'
import { Image, Responsive, Segment } from 'semantic-ui-react'
import '../style/home.css'
import logo from '../assets/logo.png'
import bugtrack from '../assets/bug on trail.png'
import randomstring from 'randomstring'
import axios from 'axios'
import cookie from 'react-cookies'

class Item1 extends React.Component{
    constructor(props){
        super(props)
        this.statetoken = randomstring.generate()
        this.state = {loggedin:false}
    }
    componentDidMount(){
        axios.get('profile/user/').then(
            (response) => {
                this.setState({loggedin:true})
            }
        ).catch(
            (error) =>{
                this.setState({loggedin:false})
            }
        )
    }
    render(){
        let url = 'https://internet.channeli.in/oauth/authorise/?client_id=InkEzNrdetKn6grsh3bEzumxUXKwVXgwxZxg2BDo&redirect_url=http://localhost:3000/loggit/&state='+this.statetoken
        if(this.state.loggedin){
            window.location='/mypage/home/'
        }
        else{
            cookie.remove('statetoken', {path: "/loggit"})
            cookie.save('statetoken', this.statetoken, {path: "/loggit"})
            return(
                <div className='item1'>
                    <div className='item1-1'>
                        <Image src= {logo} style={{width:'90px'}}/>
                        <span>&nbsp;&nbsp;</span> Bug Track
                    </div>
                    <div className ='item1-2'>
                        <a href={url}>LOGIN</a>
                    </div>
                </div>
            )
        }
    }
}


function Item2(){
    return(
        <div className='item2' id='color'>
            <div className='item2-1'>
                <div className='item2-1-1'>
                    <div className='head'>
                        Track Bugs and Issues with BT
                    </div>
                    <span style={{fontSize: '1.35em' }}>The Ultimate Issue and Bug Tracking Tool</span>
                </div>
                <div className='item2-1-2'>
                    <p>Easy to use, with an intuitive user interface and instinctive workflow, BT is the tool of choice for those who want to do their work effectively and efficiently.</p>
                </div>
            </div>
            
            <Responsive {...Responsive.onlyComputer}>
            <div className ='items2-2'>
                <Image src= {bugtrack} size='massive'/>
            </div>
            </Responsive>
        </div>
    );

}

function Item3(){
    return(
        <div className='item3' id='color2'>
            <i>Bug Tracking can be really simple !</i>
        </div>
    );
}

function Home_page (){
        return(
            <div className = 'home'>
                <Item1/>
                <Item2/>
                <Item3/>
            </div>
        );

}


export default Home_page