import React from 'react'
import {Grid, Image, Breadcrumb, Loader, Ref, Dropdown, Icon,Button, Popup, Message, Form} from 'semantic-ui-react'
import axios from 'axios'
import dompurify from 'dompurify'
import parse from 'html-react-parser';
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import randomstring from 'randomstring'

import UploadAdapter from './extras/uploadAdapter'
import trash from '../assets/trash.png'
import '../style/project.css'
import '../style/myproandbug.css'
import '../style/projectcreate.css'

const sanitizer2 = dompurify.sanitize;
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
            var c = []
            const response2 = await axios.get('project/'+this.props.pid+'/team/')
            const users = response2.data
            for( var [k, val] of Object.entries(users)){
                c.push(val)
            }
            this.setState({mem : c})
        }
        catch{
            window.location='/mypage/home'
        }
        
    }

    componentDidMount(){
        this.update()
        axios.get('/project/'+this.props.pid+'/ismember/').then( res => this.setState({ismem:res.data['member']}))
    }
    
    onsubmit = (e,{value}) => {
        axios.patch('project/'+this.props.pid+'/addmember/', {teams : value }).then(res => {
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
            lists = this.state.addmem.map( user => {
                return {
                    key:user.id,
                    value:user.id,
                    text:user.username
                }
            }
        )}
        let display = null
        if(this.state.mem){
        display = this.state.mem.map( user => <div key={user.id} className='members-project'><div><Image src={user.display_picture} avatar />{user.username}</div><div>{ this.state.ismem && <Icon name='delete' onClick={(e) => this.Delete(e, user.user)}/>}</div></div>)
        display = 
            <div className='listofmem' >
                {display}
                { this.state.ismem && <><Dropdown selection search options={lists} placeholder='Add Members' onChange={this.onsubmit}/>
                <br/>  <Popup content='Delete' position='right center' active trigger={<Image onClick={this.DeleteProject} src={trash} style={{marginTop:'10px'}}/>} />  </>}
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
/************************************************************************************** */
class CreateBugForm extends React.Component{
    constructor(props){
        super(props)
        this.state = { tag : '', head:'', body:'', randid:randomstring.generate(), errTag:'', errHead:'', errBody:'', submiterr: false}
    }
    addBug = async (e) => {
        e.preventDefault()

        if(this.state.head === ""){
            console.log('head null')
            this.setState({errHead:'Bug Heading can not be null'})
        }
        else{
            console.log(' head not null')
            this.setState({errHead:''})
        }
        if(this.state.tag === ""){
            this.setState({errTag:'Bug Tag can not be null'})
        }else{
            this.setState({errTag:''})
        }
        if(this.state.body === ""){
            this.setState({errBody:'Bug Body can not be null'})
        }else{
            this.setState({errBody:''})
        }
        if(this.state.tag !=='' && this.state.head !=='' && this.state.body !==''){
            try{
                const formData = new FormData()
                formData.append('project', this.props.project)
                formData.append('description', this.state.body)
                formData.append('head', this.state.head)
                formData.append('tag', this.state.tag)
                var res = await axios.post('bugs/',formData)
                window.location = '/mypage/bug/'+res.data.id+'/'
            }catch(err){
                this.setState({submiterr:true})
            }
        }
    }
    render(){
        let msg 
        if(this.state.errHead!== '' || this.state.errBody !== '' ||this.state.errTag !== '' ){
            msg = (
                <Message negative >
                    <h3>Invalid Inputs</h3>
                    { this.state.errHead && <p>{this.state.errHead}</p>}
                    {this.state.errBody && <p>{this.state.errBody}</p>}
                    {this.state.errTag && <p>{this.state.errTag}</p>}
                </Message>
            )
        }
        if(this.state.submiterr){
            msg = (
                <Message negative header='Error!!!' content='Some error occured during creation of bug'/>
            )
        }

        let tags = mod.tag.map( (tag, index) => {
            return {
                key: index,
                value:index,
                text:tag
            }
        })

        return(
            <>
                <span className='head-project'>Report a new Bug</span>
                <div className='Create-Project-container'>
                <Form>
                    <Form.Group>
                        <Form.Input name='name' onChange={ (e) => { this.setState({head:e.target.value})}} placeholder='Bug Heading' width={6} />
                    </Form.Group>
                    
                    <CKEditor
                        editor={ ClassicEditor }
                        data={this.state.body}
                        onInit={editor=>{
                            var randid = this.state.randid
                            editor.plugins.get('FileRepository').createUploadAdapter = function(loader){
                                return new UploadAdapter(loader, randid) 
                            }
                        }}
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.setState({body:data})
                        } }
                    />
                </Form>
                <Dropdown style={{marginTop:'10px'}} options={tags} placeholder='Tag' selection search onChange={(e, {value}) => {this.setState({tag : value})}}/> 
                <div className='foot-button-bug'><Button color='green' onClick={(e) => this.addBug(e)}>Report</Button></div>
                {msg}
                </div>
                
            </>
        )
    }
}
/****************************************************************************** */
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
        else if(ref==ref3){
            this.setState({choice : ref, load:false})
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
                                    <div className='data-project'>{parse(sanitizer2(this.state.desc.wiki))}</div>
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
            if(display.length){
                display = <div className='card_group_bug '>{display}</div>
            }
            else{
                display = <><Icon name='thumbs up' size='big'/> NO Reported Bugs <Icon name='thumbs up' flipped='horizontally' size='big' /></>
                
            }
        }

        if(this.state.choice==ref3){
            display = <CreateBugForm project={this.state.desc.id} />
        }

        return(
            
            <div className='middle-project'>
                <div className='head-project'>{this.state.desc.project_name}</div>
                <Breadcrumb size='big'>
                    <Ref innerRef={ref1}><Breadcrumb.Section link onClick={(e) => this.handleBread(e,ref1)} >Description</Breadcrumb.Section></Ref>
                    <Breadcrumb.Divider />
                    <Ref innerRef={ref2}><Breadcrumb.Section link onClick={(e) => this.handleBread(e,ref2)}>Bugs</Breadcrumb.Section></Ref>
                    <Breadcrumb.Divider />
                    <Ref innerRef={ref3}><Breadcrumb.Section link onClick={(e) => this.handleBread(e,ref3)}>Report Bug</Breadcrumb.Section></Ref>
                </Breadcrumb>
                <div className='date-project'><i>{date.toDateString()} {time[0]}</i></div>
                {this.state.load ? <Loader active={true} size='massive'/> : display}
            </div>
        )
    }
}

export default ProjectView