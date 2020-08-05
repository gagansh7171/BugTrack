import React, {Component} from 'react'
import {Loader,Image, Dropdown, Dimmer } from 'semantic-ui-react'
import logo from '../../assets/logo.png'
import axios from 'axios'
import '../../style/home.css'
import store from '../../store/store'
import { connect } from 'react-redux';

class Navbar extends Component{

    constructor(props){
        super(props)
        this.state = { user : 'no', admin : false, loggedin : false,  res : false,}
    }

    componentDidMount(){
        
        axios.get('profile/user/').then(
            (response) => {
                this.setState({loggedin:true, res:true})
                store.dispatch({
                    type: 'USER_SUCCESS',
                    user: response.data
                  });
            }
        ).catch(
            (error) =>{
                this.setState({res:true})
            }
        )
    }


    logout = () => {
        axios.get('/profile/logout').then(
            (response) => {
                this.setState({loggedin: false})
            }
        )
    }
    
    render(){



        if(this.state.res){
            if(this.state.loggedin){
                
                const trigger = (
                    <span>
                        {this.props.user['username']} <span>&nbsp;&nbsp;</span>
                        <Image src={this.props.user['display_picture']} avatar />
                    </span>
                )
                
                let adminview
                if(this.props.user['admin']){
                    adminview = <Dropdown.Item icon='spy' text='Admin'/>
                    
                }

                let nav =(
                    <div className='item1' id='color3'>
                        <div className='item1-1'>
                            <Image src= {logo} style={{width:'70px'}}/>
                            <span>&nbsp;&nbsp;</span> Bug Track
                        </div>
                        <div className ='item1-2'>
                            <Dropdown trigger={trigger}>
                                <Dropdown.Menu>
                                    {adminview}

                                    <Dropdown.Item icon='log out' text='Logout' onClick={this.logout}/>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                )

                return(
                    nav
                )
            }
            else{
                
                window.location='/'
            }
        }
        else{
            return(
                <Dimmer active>
                    <Loader active size="massive" />
                </Dimmer>
            )
        }

    }

    
}

function mapStateToProps(store) {

    return {
      user: store.Reducer.user
    };
}

export default connect(mapStateToProps)(Navbar);
