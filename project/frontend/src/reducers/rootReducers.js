
import {combineReducers} from 'redux'


const Reducer = function(state = {user:[]}, action) {
    switch(action.type) {
        case 'USER_SUCCESS':
            return Object.assign({}, state, { user: action.user });
        }
        
        return state
}


const rootReducers = combineReducers({
    Reducer,

})

export default rootReducers