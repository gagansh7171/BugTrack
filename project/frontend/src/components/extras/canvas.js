import React from 'react'

import MyProAndBug from '../myproandbug'
import Search from '../Search'
import '../../style/myproandbug.css'

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
            
        }
        else if(this.props.item==4){
            
        }
        return(<div className='canvas'>ffhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff</div>)
    }
}

export default Canvas