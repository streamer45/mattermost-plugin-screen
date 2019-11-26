const combineReducers = window.Redux.combineReducers;

import {
    OPEN_RECORDING_MODAL,
    CLOSE_RECORDING_MODAL,
} from './action_types';

const recordingModalVisible = (state = false, action) => {
    switch (action.type) {
    case OPEN_RECORDING_MODAL:
        return true;
    case CLOSE_RECORDING_MODAL:
        return false;
    default:
        return state;
    }
};

export default combineReducers({
    recordingModalVisible,
});
