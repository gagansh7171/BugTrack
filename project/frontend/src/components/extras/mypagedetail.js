import React from 'react'

import Canvas from './canvas'
import Sidebar from './sidebar'
import '../../style/sidebar.css'

class Home extends React.Component{

    constructor(props){
        super(props)
    }

    render(){

        return(
            <div className='middle'>
                <Sidebar selection={this.props.item}/>
                <Canvas/>
            </div>  
        )  
    }
}

export default Home