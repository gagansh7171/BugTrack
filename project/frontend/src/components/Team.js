import React from 'react'
import {Icon, Image} from 'semantic-ui-react'
import axios from'axios'

import '../style/admin.css'

class Members extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        let display = this.props.mem.map( user => {
            return (
                <div key={user.id} className='item'>
                    <div className='card_1'><div className='subcard_1 '>{user.username}</div> <div style={{flex:'1'}}><Image circular size='tiny' src={user.display_picture}/></div></div>
                    <div className='card_2'>E-mail : {user.email}</div>
                    <div className ='card_3'>{ user.admin && <b>Admin</b>} {user.disabled && <b>Disabled</b>}</div>
                </div>
            )
        }) 

        display = <div className='admin2'>{display}</div>
    
        return(
            display
        )
    }
}

function Project(props){
    return(
        <div className='projectTeam'>
            {Object.keys(props.project)[0]}
            
                <Members mem={Object.values(props.project)[0]}/>
            
        </div>
    )
}

class Team extends React.Component{
    constructor(props){
        super(props)
        this.state={data:[], empty:false}
    }

    fetchdata = async () => {
        
    }
    
    async componentDidMount(){
        try{
            const response = await axios.get('project/myteam/')
            const projects = response.data
    
            var b = []
            for( var [k, project] of Object.entries(projects)){
                const response2 = await axios.get('project/'+project.id+'/team/')
                const users = response2.data
                
                var c = []
                for( var [k, val] of Object.entries(users)){
                    c.push(val)
                }
                let index = project.project_name
                var a = {}
                a[index] = c
                b.push(a)
                console.log(b)
            }
            this.setState({data : b})
            
        }catch  (err) {
            this.setState({empty:true})
            return []
        }
        
    }

    render(){
        let display
        if(this.state.empty){
            display = <div className='errorForSearch'><Icon name='exclamation' size='big'/><Icon name='exclamation' size='big'/> You are not a part of any team <Icon name='exclamation' size='big'/><Icon name='exclamation' size='big' /></div>
        }
        else{

            display = this.state.data.map( (project) => 
                <Project project={project}/> 
            )

        }
        

        return(
            display
        )
    }
}
export default Team