import React from 'react'
import {Loader, Dimmer, Checkbox, Card, Image} from 'semantic-ui-react'
import axios from 'axios'
import '../style/admin.css'

class Admin extends React.Component{
    constructor(props){
        super(props)
        this.state = {data : [],res:false, erro:false}
    }

    componentDidMount(){
        axios.get('profile/adminview/').then(
            response => {
                let b =[]
                for (const [k, val] of Object.entries(response.data)){
                    b.push(val)
                }
                this.setState({data : b, res:true})  
            }
        ).catch(
            (error) => this.setState({erro :true, res:true})
        )
    }

    handleAdmin = (e, id, index) => {
        let list = this.state.data
        list[index]['admin'] = !list[index]['admin']
        this.setState({data: list})
        axios.patch('profile/'+id+'/', {admin : list[index]['admin']}).then(res => {console.log('admin changed')})
    }

    handleDisabled = (e, id, index) => {
        let list = this.state.data
        list[index]['disabled'] = !list[index]['disabled']
        this.setState({data: list})
        axios.patch('profile/'+id+'/', {disabled : list[index]['disabled']}).then(res => {console.log('disabled changed')})
    }

    render(){
        if(this.state.erro){
            window.location='/'
        }
        if(this.state.res){
            let display = this.state.data.map( (user, index) =>
            <div key={user.id} className='item'>
                <div className='card_1'><div className='subcard_1'>{user.username}<br/>{user.email}</div> <div style={{flex:'1'}}><Image circular size='tiny' src={user.display_picture}/></div></div>
                <div className='card_2'><Checkbox label={"Admin Status"} slider checked={user.admin} onChange={(e)=>{this.handleAdmin(e,user.id, index)}} /></div>
                <div className ='card_3'><Checkbox label={"Disabled Status"} slider checked={user.disabled} onChange={(e)=>{this.handleDisabled(e,user.id, index)}} /></div>
            </div>
        )
            return(
                <React.Fragment>
                    
                    <div className='admin1'>
                        List of Users
                        <div className='admin2'>
                            {display}
                        </div>
                    </div>
                </React.Fragment>
            )
        }
        else{
            return(
            <Dimmer>
                <Loader size='massive'></Loader>
            </Dimmer>
            )
        }
    }
}

export default Admin