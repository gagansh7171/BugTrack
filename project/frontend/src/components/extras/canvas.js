import React from 'react'

import MyProAndBug from '../myproandbug'
import Search from '../Search'
import Team from '../Team'
import Profile from '../Profile'
import '../../style/canvas.css'

class Canvas extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        if(this.props.item==0){
            return <div className='canvas'><MyProAndBug/></div>
        }
        else if(this.props.item==1){

        }
        else if(this.props.item==2){
            return <div className='canvas'><Search/></div>
        }
        else if(this.props.item==3){
            return <div className='canvas'><Team/></div>
        }
        else if(this.props.item==4){
            return (<div className='canvas'><Profile/></div>)
        }
        return(<div className='canvas'>ffhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff</div>)
    }
}

export default Canvas