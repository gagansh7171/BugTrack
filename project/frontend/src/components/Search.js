import React from 'react'
import {Form, Icon } from 'semantic-ui-react'
import axios from'axios'

class Search extends React.Component{
    constructor(props){
        super(props)
        this.state = {project:'', user:''}
    }

    ProjectChange = () => {
        
    }

    render(){
        return(
            <div class='search'>
            <Form>
                <Form.Group widths='4'>
                    <Icon name='book' size='big'/>
                    <Form.Input fluid placeholder='Search Project' onChange={this.ProjectChange} /><span>&nbsp;&nbsp;</span>
                    <Icon name='user' size='big'/>
                    <Form.Input fluid placeholder='Search User' onChange={this.UserChange} />
                </Form.Group>
            </Form>
            </div>
        )
    }
}

export default Search