import React from 'react'
import {Icon, Popup} from 'semantic-ui-react'
import '../../style/sidebar.css'


const Ite = React.forwardRef((props, ref) =>{
        class Ite extends React.Component{
            constructor(props){
                super(props)  
            }
            clicked = () =>{
                window.location='/mypage/'+this.props.name
            }
            render(){
                
                return(
                    <div className='item_side' ref={ref} onClick={this.clicked}>
                        <Popup content={this.props.content} position='right center' trigger={
                        <Icon inverted bordered color='green' name={this.props.name} size='huge'/>}/>
                    </div>
            
                )
            }
        }
        return <Ite {...props}/>   
    }
)

class Sidebar extends React.Component{
    constructor(props){
        super(props)
        this.ref1 = React.createRef()
        this.ref2 = React.createRef()
        this.ref3 = React.createRef()
        this.ref4 = React.createRef()
        this.ref5 = React.createRef() 
    }

    windowsize = (refs) =>{
        if(window.innerWidth < 796){

            refs.map(ref => 
                {ref.current.children[0].classList.remove('huge')
                ref.current.children[0].classList.add('big')}
            )
        }

        else{
            refs.map(ref => 
                {ref.current.children[0].classList.add('huge')
                ref.current.children[0].classList.remove('big')}
            )
        }
    }

    componentDidMount(){
        var refs = [this.ref1, this.ref2, this.ref3, this.ref4, this.ref5]
        refs[this.props.item].current.children[0].classList.remove('inverted')
        refs[this.props.item].current.style.backgroundColor = 'white'
        this.windowsize(refs)
        window.addEventListener("resize", () => this.windowsize(refs));
    }


    render(){
        let side =(        
            <div  className='side'>

                <Ite content='My Page' ref={this.ref1} name='home'/>

                <Ite content='Create Project' ref={this.ref2} name='plus'/>
                
                <Ite content='search Projects/ Users' ref={this.ref3} name='search'/>
                
                <Ite content='My Teams' ref={this.ref4} name='users'/>
                
                <Ite content='Profile' ref={this.ref5} name='user'/>
                              
            </div>
        )
        
        
        return(
            side
        )
    }
}

export default Sidebar