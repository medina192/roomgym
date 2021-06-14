import { types } from '../types/types';

export const saveUser = (user) => {

    return {
        type: types.saveUser,
        payload: {
            user
        }
    }
}

export const saveTrainer = (trainer) => {

    return {
        type: types.saveTrainer,
        payload: {
            trainer
        }
    }
}

export const T_saveTrainer = (T_trainer) => {

    return {
        type: types.T_saveTrainer,
        payload: {
            T_trainer
        }
    }
}

export const T_saveUser = (T_user) => {

    return {
        type: types.T_saveUser,
        payload: {
            T_user
        }
    }
}

export const saveSubCategorie = (subCategorie) => {

    return {
        type: types.saveSubCategorie,
        payload: {
            subCategorie
        }
    }
}

export const saveSubRoutine = (subRoutine) => {

    return {
        type: types.saveSubRoutine,
        payload: {
            subRoutine
        }
    }
}

export const saveCurrentRoutine = (currentRoutine) => {

    return {
        type: types.currentRoutine,
        payload: {
            currentRoutine
        }
    }
}

export const saveCurrentExercise = (currentExercise) => {

    return {
        type: types.currentExercise,
        payload: {
            currentExercise
        }
    }
}

export const saveIdRelation = (idRelation) => {

    return {
        type: types.idRelation,
        payload: {
            idRelation
        }
    }
}


export const saveRoutine_T = (routine) => {

    return {
        type: types.T_routinesSaved,
        payload: {
            routine
        }
    }
}


export const changeState = (state) => {
    return {
        type: types.changeState,
        payload: {
            state
        }
    }
}

export const changeStateForDocuments = (state) => {
    return {
        type: types.changeStateForDocuments,
        payload: {
            changeStateForDocuments: state
        }
    }
}

export const clearState = () => {
    return {
        type: types.clearState
    }
}


export const imageSliderCancel = (cancel) => {
    return {
        type: types.imageSliderCancel,
        payload: {
            cancel
        }
    }
}
