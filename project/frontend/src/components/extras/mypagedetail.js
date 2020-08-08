import React from 'react'

import Canvas from './canvas'
import Sidebar from './sidebar'
import '../../style/sidebar.css'

class MyPageDetail extends React.Component{

    constructor(props){
        super(props)
    
    }


    render(){
        
            return(
                <div className='middle'>
                    <Sidebar item={this.props.item}/>
                    <Canvas item={this.props.item}/>
                </div>  
            )
        
    }
}

export default MyPageDetail