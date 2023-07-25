import { createStore, combineReducers} from 'redux'
import developerModeReducer, {DeveloperModeState } from './developerModeReducer'


export interface AppState{
    developerMode: DeveloperModeState
}

const rootReducer = combineReducers({
    developerMode: developerModeReducer
})

const store = createStore(rootReducer)

export default store;


