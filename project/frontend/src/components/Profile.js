import React from 'react'
import {Image, Grid } from 'semantic-ui-react'
import axios from 'axios'

import '../style/profile.css'

class Profile extends React.Component{
    constructor(props){
        super(props)
        this.state={user:{}}
    }
    componentDidMount(){
        axios.get('profile/user/').then( response =>{
            this.setState({user:response.data})
        }).catch( error =>{
            window.location = '/mypage/home'
        })
    }
    
    render(){
        let date = new Date(this.state.user.date_joined)
        let profilecard = <div className='profilecard'>
            <Grid columns={2} divided stackable textAlign='center'>
                <Grid.Row>
                    <Grid.Column>
                        <Image src={this.state.user.display_picture} circular size='small'/>
                    </Grid.Column>
                    <Grid.Column>
                        <div className='data-profile'>
                            {this.state.user.fname ? this.state.user.fname : <i>F_Name</i>} {this.state.user.lname ? this.state.user.lname : <i>L_Name</i>}<br/>
                            @{this.state.user.username}<br/>
                            {this.state.user.email}<br/>
                            {this.state.user.enr}<br/>
                            <i>{date.toDateString()}</i><br/>
                            { this.state.user.admin && <b>Admin</b>}<br/>
                            { this.state.user.disabled && <b>Disabled</b>}
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>

        return(
            profilecard
        )
    }
}

export default Profile