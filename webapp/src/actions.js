import {
    OPEN_RECORDING_MODAL,
    CLOSE_RECORDING_MODAL,
} from './action_types';

export const openRecordingModal = () => (dispatch) => {
    dispatch({
        type: OPEN_RECORDING_MODAL,
    });
};

export const closeRecordingModal = () => (dispatch) => {
    dispatch({
        type: CLOSE_RECORDING_MODAL,
    });
};

