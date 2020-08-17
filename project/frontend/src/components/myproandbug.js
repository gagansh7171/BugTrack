import React from 'react'
import {Breadcrumb, Ref, Icon} from 'semantic-ui-react'
import axios from 'axios'

import '../style/myproandbug.css'

var mod = require('../style/color')

var ref1 = React.createRef()
var ref2 = React.createRef()
var ref3 = React.createRef()

function gotoproject(e, id){
    window.location = '/mypage/project/'+id
}

function Cards(props){
    let index = (props.id-1) % 13
    let date = new Date(props.date)
    let time = date.toTimeString().split(' ')
    return(
        <div className='card_contain' onClick={(e) => gotoproject(e, props.id)} style={{borderBottom: '4px solid '+mod.color[index]}}>
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
/**************************************************************************************************** */
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

function gotobug(e, id) {
    window.location = '/mypage/bug/'+id+'/'
}

function CardsForBug(props){
    let index = (props.id-1) % 13
    let date = new Date(props.date)
    let time = date.toTimeString().split(' ')
    let use
    if (props.comingfrom==0){
        use =
            <div className='card2_bug'>
            <div>Project : {props.project.project_name} <br></br>Creator : {props.creator}</div> <div>{time[0]} {date.toDateString()}</div>
            </div>
    }
    else {
        use =
            <div className='card2_bug'>
            <div>Project : {props.project.project_name}<br></br> Assigned To : {props.assigned_to}</div> <div>{time[0]} {date.toDateString()}</div>
            </div>

    }
    return(
        <div onClick = {(e) => gotobug(e, props.id)} className='card_contain_bug' style={{borderBottom: '4px solid '+mod.color[index]}}>
            <div className='card1_bug'>
                <div className='sub_card1_bug'>{props.head}</div>
                <Tag tag={props.tag} />
                <Status status={props.status}/>
            </div>
            {use}
        </div>
    )
}

/**************************************************************************************************** */

class MyProAndBug extends React.Component{
    constructor(props){
        super(props)
        this.state = {data : [],error:false, choice:undefined}
    }

    componentDidMount(){
        ref1.current.classList.add('active')
        this.setState({choice:ref1})
        var b=[]
        axios.get('profile/projects').then(
            response => {
                for (const [k, val] of Object.entries(response.data)){
                    b.push(val)
                }
                this.setState({data : b})  
            }
        ).catch(
            (error) =>{
                this.setState({error:true})
            }
        )
        
    }

    updateData = (ref) => {
        var b = []
        if(ref==ref1){
            axios.get('profile/projects').then(
                response => {
                    for (const [k, val] of Object.entries(response.data)){
                        b.push(val)
                    }
                    this.setState({data : b, choice:ref})
                    
               
                }
            ).catch(
                (error) =>{
                    this.setState({error:true})
                }
            )
        }

        else if(ref==ref2){
            axios.get('bugs/assigned').then(
                response => {
                    for (const [k, val] of Object.entries(response.data)){
                        b.push(val)
                    }
                    this.setState({data : b, choice:ref})
                }
            ).catch(
                (error) =>{
                    this.setState({error:true})
                }
            )
        }
        else if(ref==ref3){
            axios.get('bugs/reported').then(
                response => {
                    for (const [k, val] of Object.entries(response.data)){
                        b.push(val)
                    }
                    this.setState({data : b, choice:ref})
                }
            ).catch(
                (error) =>{
                    this.setState({error:true})
                }
            )
        }
        
    }

    handleBread = (e, ref) => {
        
        this.state.choice.current.classList.remove('active')
        ref.current.classList.add('active')
        this.updateData(ref)
    }

    render(){
        
        let sections = (
            
            <Breadcrumb size='big'>
                <Ref innerRef={ref1}><Breadcrumb.Section link onClick={(e) => this.handleBread(e,ref1)}>My Projects</Breadcrumb.Section></Ref>
                <Breadcrumb.Divider />
                <Ref innerRef={ref2}><Breadcrumb.Section link onClick={(e) => this.handleBread(e,ref2)}>Assigned Bugs</Breadcrumb.Section></Ref>
                <Breadcrumb.Divider />
                <Ref innerRef={ref3}><Breadcrumb.Section link onClick={(e) => this.handleBread(e,ref3)}>Reported bugs</Breadcrumb.Section></Ref>
            </Breadcrumb>
        )
        
        let display 

        if(this.state.choice==ref1){
            display = this.state.data.map( (project) =>
                <Cards key={project.id} {...project} />
            )
            if(display.length){
                display = <div className='card_group'>{display}</div>
            }
            else{
                display = <div style={{marginTop:'15px'}}><Icon flipped='horizontally' name='exclamation' size='big'/> You are not a part of any project <Icon name='exclamation' size='big' /></div>
            }
        }

        if(this.state.choice==ref2){
            let comingfrom = 0
            display = this.state.data.map( (bug) =>
                <CardsForBug key={bug.id} {...bug} comingfrom={comingfrom}/>
            )
            if(display.length){
                display = <div className='card_group_bug'>{display}</div>
            }
            else{
                display = <div style={{marginTop:'15px'}}><Icon name='thumbs up' size='big'/> NO Assigned Bugs <Icon name='thumbs up' flipped='horizontally' size='big' /></div>
            }
        }

        if(this.state.choice==ref3){
            let comingfrom = 1
            display = this.state.data.map( (bug) =>
                <CardsForBug key={bug.id} {...bug} comingfrom={comingfrom}/>
            )
            
            if(display.length){
                display = <div className='card_group_bug'>{display}</div>
            }
            else{
                display = <div style={{marginTop:'15px'}}><Icon flipped='horizontally' name='question' size='big'/> NO Reported Bugs <Icon name='question'  size='big' /></div>
            }
        }

        if(this.state.error){
            window.location='/'
        }
        else{
            
            return(
                <React.Fragment>
                {sections}
                {display}
                </React.Fragment>
            )
        }
    }
}

export default MyProAndBug