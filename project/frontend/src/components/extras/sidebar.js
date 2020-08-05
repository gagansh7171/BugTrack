import React from 'react'
import {Icon, Popup} from 'semantic-ui-react'
import '../../style/sidebar.css'



class Ite extends React.Component{
    constructor(props){
        super(props)
    }
    clicked = () =>{
        window.location='/mypage/'+this.props.name
    }
    render(){
        return(
            
            <div className='item' onClick={this.clicked}>
                <Popup content={this.props.content} position='right center' trigger={
                <Icon id={this.props.id} onClick={this.props.click} inverted bordered color='green' name={this.props.name} size='huge'/>}/>
            </div>
    
        )
    }
}

class Sidebar extends React.Component{
    constructor(props){
        super(props)
        this.state = {prev : this.props.selection}
        
    }


    componentDidMount(){

        document.getElementById(this.state.prev).className = 'green '+ document.getElementById(this.state.prev).className.split(' ')[1] +' huge bordered icon'
        document.getElementById(this.state.prev).parentElement.style.backgroundColor = 'white'
    }


    render(){
        
        let side =(        
            <div key={this.props.selection} className='side'>

                <Ite content='My Page' id='item1' name='home'/>

                <Ite content='Create Project' id='item2' name='plus'/>
                
                <Ite content='search Projects/ Users' id='item3' name='search'/>
                
                <Ite content='My Teams' id='item4' name='users'/>
                
                <Ite content='Profile' id='item5' name='user'/>
                              
            </div>
        )
        
        
        return(
            side
        )
    }
}

export default Sidebar