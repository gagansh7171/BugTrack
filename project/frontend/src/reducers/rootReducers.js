
import {combineReducers} from 'redux'


const Reducer = function(state = {user:[]}, action) {
    switch(action.type) {
        case 'USER_SUCCESS':
            return Object.assign({}, state, { user: action.user });
        }
        
        return state
}

const SideReducer = function(state = {item:'item1'}, action) {
    
    switch(action.type) {
        case 'SIDE':
            
            var a = Object.assign({}, state, { item: action.item });
            return a
        }
        
        return state
}


const rootReducers = combineReducers({
    Reducer,
    SideReducer
})

export default rootReducers