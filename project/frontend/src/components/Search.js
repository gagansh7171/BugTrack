import React from 'react'
import {Form, Icon, Image, Loader} from 'semantic-ui-react'
import axios from'axios'
import querystring from 'querystring' /*For making post request easier*/

import '../style/admin.css'
import '../style/myproandbug.css'

function gotoproject(e, id){
    window.location = '/mypage/project/'+id
}

function Cards(props){
    let date = new Date(props.date)
    let time = date.toTimeString().split(' ')
    return(
        <div className='card_contain' onClick={(e) => gotoproject(e, props.id)}  >
            <div className='card1'>{props.project_name}</div>
            <div className='card2'>{props.wiki}</div>
            <div className='card3'>
                <div><Icon name='user' /> {props.teams.length} Members</div>
                <div>
                    <i>{time[0]} {time[1]}<br/>
                    {date.toDateString()}</i>
                </div>
            </div>
        </div>
    )
}

class Search extends React.Component{
    constructor(props){
        super(props)
        this.state = {project:'', user:'', which:'', load : false} 
    }

    ProjectChange = (e) => {
        this.setState({load:true})
        let b = []
        axios.get('project/search?'+querystring.stringify({'slug' : e.target.value})).then(
            response => {
                for (const [k, val] of Object.entries(response.data)){
                    b.push(val)
                }
                
                if(b.length==0){
                    this.setState({which:'error',load:false})
                }
                else{
                    this.setState({project:b, which:'project',load:false})
                }
            }
        ).catch((error) => {
            this.setState({which:'error',load:false})
        })
    }

    gotouser = (e, id) =>{
        window.location = '/mypage/user/'+id
    }

    UserChange = (e) => {
        this.setState({load:true})
        let b = []
        axios.get('profile/search?'+querystring.stringify({'slug' : e.target.value})).then( 
            response => {
                
                for (const [k, val] of Object.entries(response.data)){
                    b.push(val)
                }
                
                if(b.length==0){
                    this.setState({which:'error',load:false})
                }
                else{
                    this.setState({user:b, which:'user',load:false})
                }
            }
        ).catch((error) => {
            this.setState({which:'error',load:false})
        
        })
    }

    render(){

        let display
        if(this.state.which=='error'){
            display = <div className='errorForSearch'><Icon name='question' flipped='horizontally' size='big'/> NO MATCH <Icon name='question' size='big' /></div>
        }
        if(this.state.which=='user'){
            display = this.state.user.map( user => {
                return (
                    
                    <div key={user.id} onClick={(e) => this.gotouser(e, user.id)} className='item'>
                        <div className='card_1'><div className='subcard_1 '>{user.username}</div> <div style={{flex:'1'}}><Image circular size='tiny' src={user.display_picture}/></div></div>
                        <div className='card_2'>E-mail : {user.email}</div>
                        <div className ='card_3'>{ user.admin && <b>Admin</b>} {user.disabled && <b>Disabled</b>}</div>
                    </div>
                    
                )
            }) 

            display = <div className='admin2'>{display}</div>
            
        }

        if(this.state.which=='project'){
            display = this.state.project.map( (project) =>
                <Cards {...project} />
            )
            display = <div className='card_group'>{display}</div>
        }

        return(
            <React.Fragment>
                <Form>
                    <Form.Group widths='4'>
                        <Icon name='book' size='big'/>
                        <Form.Input fluid placeholder='Search Project' onChange={this.ProjectChange} /><span>&nbsp;&nbsp;</span>
                        <Icon name='user' size='big'/>
                        <Form.Input fluid placeholder='Search User' onChange={this.UserChange} />
                    </Form.Group>
                </Form>
                
                {this.state.load ? <Loader active='true' size='massive'/> : display}
   
            </React.Fragment>
        )
    }
}

export default Search