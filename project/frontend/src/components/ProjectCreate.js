import React from 'react'
import {Form, Button, Message} from 'semantic-ui-react'
import axios from 'axios'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import randomstring from 'randomstring'

import UploadAdapter from './extras/uploadAdapter'
import '../style/projectcreate.css'

class ProjectView extends React.Component{
    constructor(props){
        super(props)
        this.state = {name:'', body: '', randid:randomstring.generate(), errorHead:'', errorBody:'', submiterr : false}
    }

    addProject = async (e) => {
        e.preventDefault()

        if(this.state.name === ""){
            this.setState({errorHead:'Project Heading can not be null'})
        }
        else{
            this.setState({errorHead:''})
        }
        if(this.state.body === ""){
            this.setState({errorBody:'Project Body can not be null'})
        }
        else{
            this.setState({errorBody:''})
        }

        if(this.state.name !== '' && this.state.body !== '' ){
            try{
                const formData = new FormData()
                formData.append('project_name',this.state.name )
                formData.append( 'wiki' ,this.state.body)
                var res = await axios.post('project/', formData)
                window.location = '/mypage/project/'+res.data.id+'/'
            }catch (err){
                this.setState({submiterr:true})
            }
        }
    }

    render(){
        let msg 
        if(this.state.errorHead!== '' || this.state.errorBody !== '' ){
            msg = (
                <Message negative >
                    <h3>Invalid Inputs</h3>
                    { this.state.errorHead && <p>{this.state.errorHead}</p>}
                    {this.state.errorBody && <p>{this.state.errorBody}</p>}
                </Message>
            )
        }
        if(this.state.submiterr){
            msg = (
                <Message negative header='Error!!!' content='Some error occured during creation of project'/>
            )
        }
        return(
            <>
                <span className='head-project'>Create a New Project</span>
                <div className='Create-Project-container'>
                <Form>
                    <Form.Group>
                        <Form.Input name='name' onChange={ (e) => { this.setState({name:e.target.value})}} placeholder='Project Name' width={6} />
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
                <div className='foot-button-bug'><Button color='green' onClick={(e) => this.addProject(e)}>Create</Button></div>
                {msg}
                </div>
                
            </>
        )
    }
}

export default ProjectView