import { ActionType, getType }from 'typesafe-actions'
import { toggleDeveloperMode } from './actions';

export interface DeveloperModeState {
    developerMode: boolean;
}

const initialState: DeveloperModeState = {
    developerMode: false,
}

export default function developerModeReducer(
    state = initialState, 
    action:RootAction
    ): DeveloperModeState{
    switch (action.type){
        case getType(toggleDeveloperMode):
            return {
                ...state,
                developerMode: !state.developerMode,
            };
        default:
            return state;
    }
}

export type RootAction = ActionType<typeof toggleDeveloperMode>


