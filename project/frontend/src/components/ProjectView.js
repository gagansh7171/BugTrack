import React from 'react'
import {Grid, Image, Breadcrumb, Loader, Ref, Input, Icon, Popup} from 'semantic-ui-react'
import axios from 'axios'
import querystring from 'querystring'

import trash from '../assets/trash.png'
import '../style/project.css'
import '../style/myproandbug.css'
var mod = require('../style/color')


var ref1 = React.createRef()
var ref2 = React.createRef()
var ref3 = React.createRef()

class Members extends React.Component{
    constructor(props){
        super(props)
        this.state = {addmem:'', mem: '', ismem:''}
    }

    update = async () => {
        try{
            var b =[]
            var response = await axios.get('project/'+this.props.pid+'/addmem/')
            
            for ( const [k, val] of Object.entries(response.data)){
                    b.push(val)
                }
            this.setState({addmem:b})
            console.log(this.state.addmem)
            var c = []
            const response2 = await axios.get('project/'+this.props.pid+'/team/')
            const users = response2.data
            for( var [k, val] of Object.entries(users)){
                c.push(val)
            }
            this.setState({mem : c})
            console.log(this.state.mem)
        }
        catch{
            window.location='/mypage/home'
        }
        
    }

    componentDidMount(){
        this.update()
        axios.get('/project/'+this.props.pid+'/ismember/').then( res => this.setState({ismem:res.data['member']}))
    }
    
    onsubmit = (e,ref) => {
        var r
        for (var i = 0; i < this.state.addmem.length; i++){
            if(ref.current.children[0].value == this.state.addmem[i].username){
                r = this.state.addmem[i].id
                break
            }
        }
        console.log(r)
        axios.patch('project/'+this.props.pid+'/addmember/', {teams : r }).then(res => {
            console.log(res)
            this.update()
        }).catch(error =>
            console.log(error)
        )
    }
    Delete = (e, id)=>{
        axios.patch('project/'+this.props.pid+'/deletemem/', {teams : id}).then(res => {
            console.log(res)
            this.update()
        }).catch(error =>
            console.log(error)
        )
    }

    DeleteProject = () => {
        axios.delete('project/'+this.props.pid).then(res => window.location='/mypage/home/')
    }

    render(){
        let lists
        if(this.state.addmem){
            lists = this.state.addmem.map( user => 
            <option value={user.username} key={user.id}/>
        )}
        let display = null
        if(this.state.mem){
        display = this.state.mem.map( user => <div key={user.id} className='members-project'><div><Image src={user.display_picture} avatar />{user.username}</div><div>{ this.state.ismem && <Icon name='delete' onClick={(e) => this.Delete(e, user.user)}/>}</div></div>)
        display = 
            <div className='listofmem' >
                {display}
                { this.state.ismem && <><Ref innerRef={ref3}><Input list='users' placeholder='Add Members' action={{color: 'green', icon: 'plus', onClick: (e) => this.onsubmit(e,ref3)}}/></Ref>
                <br/>  <Popup content='Delete' position='right center' active trigger={<Image onClick={this.DeleteProject} src={trash} style={{marginTop:'10px'}}/>} />  </>}
                <datalist id ='users'>
                    {lists}
                </datalist>
            </div>
        }
    return(
        display  
    )
    }
}

/**************************************************************** */
function Status(props){
    return(<div style={{flex:'1'}}>
        <div className='tagandstatus' style={{backgroundColor: mod.color[props.status]}}>{mod.status[props.status]}</div>
        </div>
    )
}

function Tag(props){
    return(<div style={{flex:'2'}}>
        <div className='tagandstatus' style={{ backgroundColor: mod.color[12 - props.tag]}}>{mod.tag[props.tag]}</div>
        </div>
    )
}

function CardsForBug(props){
    let index = (props.id-1) % 13
    let date = new Date(props.date)
    let time = date.toTimeString().split(' ')
    let use
    if (props.comingfrom==0){
        use =
            <div className='card2_bug'>
            <div>Project : {props.project} <br></br>Creator : {props.creator}</div> <div>{time[0]} {date.toDateString()}</div>
            </div>
    }
    else {
        use =
            <div className='card2_bug'>
            <div>Project : {props.project}<br></br> Assigned To : {props.assigned_to}</div> <div>{time[0]} {date.toDateString()}</div>
            </div>

    }
    return(
        <div className='card_contain_bug' style={{borderBottom: '4px solid '+mod.color[index]}}>
            <div className='card1_bug'>
                <div className='sub_card1_bug'>{props.head}</div>
                <Tag tag={props.tag} />
                <Status status={props.status}/>
            </div>
            {use}
        </div>
    )
}
/************************************************************************************** */
class ProjectView extends React.Component{
    constructor(props){
        super(props)
        this.state = {choice:undefined, desc:'', bug:'',addmem:'', load:true}
    }

    async componentDidMount(){
        ref1.current.classList.add('active')

        this.setState({choice:ref1})
        try {
            const response = await axios.get('project/' + this.props.match.params.projectId +'/')
            const project = response.data
            this.setState({desc:project, load:false})
        }
        catch(err){
            window.location = '/mypage/home'
        }
    }

    getProjectData = async (ref)  => {
        this.setState({choice:ref, load:false})
    }

    getBugData = async (ref)  => {
        try {
            var c = []
            const response2 = await axios.get('project/'+this.state.desc.id+'/bugs/')
            var bugs = response2.data
            for( var [k, val] of Object.entries(bugs)){
                c.push(val)
            }
            this.setState({bug:c,choice:ref, load:false})
            console.log(this.state.bug)
        }
        catch(err){
            window.location = '/mypage/home'
        }
    }

    updateData = (ref) => {
        if(ref==ref1){
            this.getProjectData(ref)
        }
        else if(ref==ref2){
            this.getBugData(ref)
        }
    }

    handleBread = (e, ref) => {
        this.setState({load:true})
        this.state.choice.current.classList.remove('active')

        ref.current.classList.add('active')

        this.updateData(ref)
    }

    render(){
        let date = new Date(this.state.desc.date)
        let time = date.toTimeString().split(' ')
        let display
        if(this.state.choice==ref1){
            display = <Grid columns={2} divided stackable>
                        <Grid.Row>
                            <Grid.Column width={12}>
                                <div className='body-project'>
                                    <div className='data-project'>{this.state.desc.wiki}</div>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <div className='head-project'>Members</div>
                                <Members pid={this.state.desc.id}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
        }

        if(this.state.choice==ref2){
            display = this.state.bug.map( (eachbug) =>
                <CardsForBug key={eachbug.id}  {...eachbug}/>
            )
            display = <div className='card_group_bug'>{display}</div>
        }

        return(
            
            <div className='middle-project'>
                <div className='head-project'>{this.state.desc.project_name}</div>
                <Breadcrumb size='big'>
                    <Ref innerRef={ref1}><Breadcrumb.Section link onClick={(e) => this.handleBread(e,ref1)} >Description</Breadcrumb.Section></Ref>
                    <Breadcrumb.Divider />
                    <Ref innerRef={ref2}><Breadcrumb.Section link onClick={(e) => this.handleBread(e,ref2)}>Bugs</Breadcrumb.Section></Ref>
                </Breadcrumb>
                <div className='date-project'><i>{date.toDateString()} {time[0]}</i></div>
                {this.state.load ? <Loader active={true} size='massive'/> : display}
            </div>
        )
    }
}

export default ProjectView