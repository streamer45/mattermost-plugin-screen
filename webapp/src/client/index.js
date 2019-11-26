export const isRecordingSupported = () => {
    try {
        return navigator.mediaDevices && MediaRecorder.isTypeSupported('video/webm; codecs=h264');
    } catch {
        return false;
    }
};

