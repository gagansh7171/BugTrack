import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {Icon} from 'semantic-ui-react'
import MyPageDetail from './extras/mypagedetail'
import Navbar from './extras/navbar'
import Admin from './admin'
import ProfileView from './ProfileView'
import ProjectView from './ProjectView'
import BugView from './BugView'

class Mypage extends React.Component{
    constructor(props){
        super(props)
        this.state={loading:true}
        
    }
    componentDidMount(){
        this.setState({loading:false})
    }
    render(){
        if (this.state.loading){
            return null
        }
        else{
            return(
                <React.Fragment>
                    <Navbar />
                    
                    <Router>
                        <Switch>
                            <Route exact path={"/mypage/bug/:bugId"} render={ (props) => <BugView {...props}/>} />
                            <Route exact path={"/mypage/project/:projectId"} render={ (props) => <ProjectView {...props}/>} />
                            <Route exact path={"/mypage/home"} render={ () => <MyPageDetail item={0}/>} />
                            <Route exact path={"/mypage/plus"} render={ () => <MyPageDetail item={1}/>} />
                            <Route exact path={"/mypage/search"} render={ () => <MyPageDetail item={2}/>} />
                            <Route exact path={"/mypage/users"} render={ () => <MyPageDetail item={3}/>} />
                            <Route exact path={"/mypage/user/:userId"} render={ (props) => <ProfileView {...props} />} />
                            <Route exact path={"/mypage/user/"} render={ () => <MyPageDetail item={4}/>} />
                            <Route exact path={"/mypage/admin"} render={ () => <Admin/>} />
                            
                        </Switch>
                    </Router>
                    <div className='footer item3'>Star this project at Github <a href='https://github.com'> <Icon name='github square' color='green' /></a> </div>
                </React.Fragment>
            )
        }
    }
}

export default Mypage