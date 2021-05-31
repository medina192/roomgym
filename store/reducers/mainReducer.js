import { types } from '../types/types';

const initialState = {
    user: '',
    trainer: '',
    T_trainer: '',
    T_user: '',
    subRoutine: {},
    subCategorie: {},
    idRelation: 0,
    routineT: [],
    currentRoutine: {},
    currentExercise: {},
    changeState: false,
}

export const mainReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.saveUser:
            return{
                ...state,
                user: action.payload.user
            }
        case types.saveTrainer:
            return{
                ...state,
                trainer: action.payload.trainer
            }
        case types.T_saveTrainer:
            return{
                ...state,
                T_trainer: action.payload.T_trainer
            }
        case types.T_saveUser:
            return{
                ...state,
                T_user: action.payload.T_user
            }
        case types.saveSubCategorie:
            return{
                ...state,
                subCategorie: action.payload.subCategorie
            }
        case types.saveSubRoutine:
            return{
                ...state,
                subRoutine: action.payload.subRoutine
            }
        case types.currentRoutine:
            return{
                ...state,
                currentRoutine: action.payload.currentRoutine
            }   
        case types.currentExercise:
            return{
                ...state,
                currentExercise: action.payload.currentExercise
            }    
        case types.idRelation:
            return{
                ...state,
                idRelation: action.payload.idRelation
            }    
        case types.T_routinesSaved:
            return{
                    ...state,
                    routineT: action.payload.routine
                }    
        case types.changeState:
            return{
                ...state,
                changeState: action.payload.state
            }
        case types.clearState:
            return{
                user: '',
                trainer: '',
                T_trainer: '',
                T_user: '',
                subRoutine: {},
                subCategorie: {},
                idRelation: 0,
                routineT: [],
                currentRoutine: {},
                currentExercise: {},
                changeState: false,
            }   
        break;
    
        default:
            return state;
        break;
    }
}

