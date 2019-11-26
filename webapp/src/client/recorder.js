import Remuxer from './remuxer.js';

function getPixelRatio() {
    const ctx = document.createElement('canvas').getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const bsr = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;
    return dpr / bsr;
}

function getScreenResolution() {
    const PIXEL_RATIO = getPixelRatio();
    const width = Math.ceil((PIXEL_RATIO * window.screen.width) / 8.0) * 8;
    const height = Math.ceil((PIXEL_RATIO * window.screen.height) / 8.0) * 8;
    return {
        width,
        height,
    };
}

async function startCapture(displayMediaOptions) {
    let captureStream;
    if (navigator.mediaDevices) {
        try {
            // chrome
            captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        } catch {
            // electron
            captureStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                    },
                },
            });
        }
    }
    return captureStream;
}

export default class ScreenRecorder {
    constructor() {
        this.remuxer = new Remuxer();
        this.startTime = null;
        this.track = null;
        this.recorder = null;
        this._onStop = null;
        this._onData = null;
    }

    async start() {
        const resolution = getScreenResolution();
        const stream = await startCapture({
            video: {
                cursor: 'always',
                width: resolution.width / 2,
            },
            audio: false,
        });
        this.track = stream.getVideoTracks()[0];

        this.track.onended = () => {
            this.recorder.stop();
            if (this._onStop) {
                this._onStop();
            }
        };

        // const trackSettings = this.track.getSettings();

        this.recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm; codecs=h264',
            videoBitsPerSecond: 2000000,
        });

        this.recorder.ondataavailable = async (ev) => {
            const buffer = await ev.data.arrayBuffer();
            const data = await this.remuxer.remux(buffer);
            if (this._onData) {
                this._onData(data);
            }
        };

        this.recorder.start();
        this.startTime = new Date().getTime();
    }

    stop(cancel) {
        if (!this.track || !this.recorder) {
            return;
        }
        if (cancel) {
            this._onData = null;
        }

        this.track.stop();
        this.recorder.stop();
        this.startTime = null;
        this._onStop = null;
        this.track = null;
    }

    on(type, cb) {
        if (type === 'stop') {
            this._onStop = cb;
        } else if (type === 'data') {
            this._onData = cb;
        }
    }
}
