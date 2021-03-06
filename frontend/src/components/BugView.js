import React from 'react'
import axios from 'axios'
import {Loader, Grid, Image, Icon,Button, Dropdown, Accordion, Popup} from 'semantic-ui-react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import dompurify from 'dompurify'
import parse from 'html-react-parser'
import randomstring from 'randomstring'
import _ from "lodash" 

import UploadAdapter from './extras/uploadAdapter'
import '../style/bugview.css'
import '../style/project.css'
import trash from '../assets/trash.png'
import '../style/avatar.css'

var mod = require('../style/color')
const sanitizer1 = dompurify.sanitize;

class Comments extends React.Component{
    constructor(props){
        super(props)
        this.state = {com:[]}
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        
        if(prevState.com !== nextProps.com){
            
            return {com:nextProps.com}
        }
        return null
    }
    render(){
        let display = this.state.com.map( com => 
            {
                let date = new Date(com.date)
                let time = date.toTimeString().split(' ')
                return <div className='comment'>
                    {com['creator']['profile']['display_picture']==='http://localhost:8000/media/pic/default_profile_photo.jpeg' ? 
                                <div class='avatar-circle' style={{backgroundColor : mod.color[com.creator.profile.id % 13], verticalAlign:'middle', width:'42px', height:'40px', display:'inline-block'}}><span class='initials' style={{'fontSize':'20px','top':'-3px' }}>{com.creator.first_name[0]}{com.creator.last_name[0]}</span></div> 
                                : <Image src={com['creator']['profile']['display_picture']} size='mini' verticalAlign='middle'/>
                        }
                    
                     @<i>{com['creator']['username']}</i><br/><br/>{parse(sanitizer1(com['description']))}<div className='date-project'><i>{date.toDateString()} {time[0]}</i></div></div>
        })
        return(<>
                <div className='comment-contain'>{display}</div>
            </>
        )
    }
}
/************************************************************************************************* */
function Status(props){
    return(
        <div className='tagandstatus' style={{backgroundColor: mod.color[props.status], display:'inline-block'}}>{mod.status[props.status]}</div>
      
    )
}

function Tag(props){
    return(
        <div className='tagandstatus' style={{ backgroundColor: mod.color[12 - props.tag], display:'inline-block'}}>{mod.tag[props.tag]}</div>
       
    )
}

class Info extends React.Component{
    constructor(props){
        super(props)
        this.state = {members:'', bug:''}
    }
    update = async () =>{
        try{
            var response = await axios.get('bugs/'+this.props.bug.id+'/teammem/')
            this.setState({members:response.data})
            response = await axios.get('bugs/'+this.props.bug.id+'/')
            this.setState({bug:response.data})
        }catch(err){
            // window.location = '/' 
        }
    }
    componentDidMount(){
        this.update()
        
    }

    tagchange = (e , {value}) =>{
        axios.put('bugs/'+this.props.bug.id+'/tag/', {tag : value})
        this.update()   
    }

    assignchange = (e , {value}) =>{
        axios.put('bugs/'+this.props.bug.id+'/assign_to/', {assigned_to : value})
        this.update()
        
    }
    statuschange = (e) => {
        axios.put('bugs/'+this.props.bug.id+'/status/')
        this.update()
    }
    DeleteBug = (e) => {
        axios.delete('bugs/'+this.state.bug.id+'/')
        window.location='/mypage/project/'+ this.state.bug.project.id
    }
    render(){
        let lists = []
        if(this.state.members){
            lists = this.state.members.map( (mem, index) => {
                return {
                    key:mem.id,
                    value:mem.id,
                    text:mem.username
                }
            })
        }
        let tags = mod.tag.map( (tag, index) => {
            return {
                key: index,
                value:index,
                text:tag
            }
        })
        return (
            <>
                <div>Project : {this.props.bug.project.project_name}</div> 
                <div style={{marginTop:'10px'}}>Reporter : {this.state.bug.creator}</div>
                <div style={{marginTop:'10px'}}>Assigned to : {this.state.bug.assigned_to}<span>&nbsp;&nbsp;&nbsp;</span>
                    {this.props.member && <><Icon name='settings' size='small'/> <Dropdown search selection options={lists} placeholder='Assign bug' onChange={this.assignchange}/> </>}
                
                    </div>
                <div style={{marginTop:'10px'}}>Status : <Status status={this.state.bug.status}/><span>&nbsp;&nbsp;&nbsp;</span>
                    {this.props.member && <Dropdown options={[{'key':1, value:1,text:'Resolved'}]} trigger= {<Icon name='settings' size='small'/>} onChange={this.statuschange} /> }
                        
                </div>
                <div style={{marginTop:'10px'}}>Tag : <Tag tag={this.state.bug.tag}/><span>&nbsp;&nbsp;&nbsp;</span>{this.props.member && <Dropdown options={tags} trigger={<Icon name='settings' size='small'/>} onChange={this.tagchange}/> }</div>
                <br/> {this.props.member && <Popup content='Delete' position='right center' active trigger={<Image onClick={this.DeleteBug} src={trash} style={{marginTop:'10px'}}/>} />}
            </>
        )
    }
}
/********************************************************************************************** */
class BugView extends React.Component{
    constructor(props){
        super(props)
        this.state = {load:true, member: false,bug:'', comments:'',randid:randomstring.generate() ,commentdata:'Add a new Comment', showcomments:false}
        
        let url= 'ws://localhost:8000/ws/bug/'+this.props.match.params.bugId+'/'

        this.ws = new WebSocket(url)

        this.ws.onopen = () => {
            console.log("******Connected**********")
        }
    }

    async componentDidMount(){

        this.ws.onmessage= async (event) => {
            let result = JSON.parse(event.data)
            var newcommentslist = _.cloneDeep(this.state.comments)

            var response = await axios.get('consumer/'+result.comment+'/comment/')

            newcommentslist.unshift(response.data)

            this.setState({comments : newcommentslist, commentdata:'Add new Comment'})        
        }
        this.ws.onclose= () => {
            console.log('**********socket closed unexpectedly*********** ')
        }
        try {
            var response = await axios.get('bugs/'+this.props.match.params.bugId+'/team/')
            this.setState({member : response.data['member']})
            var response = await axios.get('bugs/'+this.props.match.params.bugId+'/')
            this.setState({bug: response.data})
            response = await axios.get('bugs/'+this.props.match.params.bugId+'/comments/')
            this.setState({comments : response.data, load:false})
        }
        catch(err){
            // window.location = '/' 
            
        }
    }

    handleCommentShow = () => {
        var a = this.state.showcomments
        this.setState({showcomments : !a})
    }

    addComment = async () => {
        try{
            var res = await axios.post('/comments/', {bug:this.state.bug.id, description : this.state.commentdata}, )
            this.ws.send(JSON.stringify({comment_id: res.data['id']}))
        }catch(err){
            // window.location = '/' 
        }
    }

    render(){
    
        let date = new Date(this.state.bug['date'])
        let time = date.toTimeString().split(' ')
        let display

        if(!this.state.load){
        display = <Grid columns={2} divided stackable style={{paddingBottom:'25px'}}>
                        <Grid.Row>
                            <Grid.Column width={12}>
                                <div className='body-project'>
                                    <div className='data-project'>{parse(sanitizer1(this.state.bug['description']))}</div>
                                    <Accordion>
                                        <Accordion.Title onClick={this.handleCommentShow}> 
                                            <Button>Comments</Button>
                                        </Accordion.Title>
                                        <Accordion.Content active={this.state.showcomments}>
                                            <Comments com={this.state.comments} />
                                        </Accordion.Content>
                                    </Accordion>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <div className='head-project'>Info</div>
                                <Info member={this.state.member} bug={this.state.bug}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
        }
        return (
            <div className='middle-project'>
                <div className='head-project'>{this.state.bug['head']}</div>
                <div className='date-project'><i>{date.toDateString()} {time[0]}</i></div>
                {this.state.load ? <Loader active={true} size='massive'/> : display}
                <CKEditor
                    editor={ ClassicEditor }
                    data={this.state.commentdata}
                    onInit={editor=>{
                        var randid = this.state.randid
                        editor.plugins.get('FileRepository').createUploadAdapter = function(loader){
                            return new UploadAdapter(loader, randid) 
                        }
                    }}
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        this.setState({commentdata:data})
                    } }
                />
                <div className='foot-button-bug'><Button color='green' onClick={this.addComment}>Comment</Button></div>
            </div>
        )
        

    }

}

export default BugView