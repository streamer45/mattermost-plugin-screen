import {Decoder} from 'ts-ebml';
import './mux.js';

export default class Remuxer {
    constructor() {
        this.decoder = new Decoder();
    }

    remux(buffer) {
        return new Promise((resolve) => {
            const els = this.decoder.decode(buffer);

            // eslint-disable-next-line no-undef
            const h264Stream = new muxjs.codecs.h264.H264Stream();

            const videoTrack = {
                timelineStartInfo: {
                    baseMediaDecodeTime: 0,
                },
                id: 0,
                codec: 'avc',
                type: 'video',
                duration: 0,
            };

            // eslint-disable-next-line no-undef
            const segmenter = new muxjs.mp4.VideoSegmentStream(videoTrack);

            segmenter.on('data', (data) => {
                data.track.duration = 0;
                // eslint-disable-next-line no-undef
                const initSegment = muxjs.mp4.generator.initSegment([data.track]);
                const blob = new Blob([initSegment, data.boxes], {type: 'video/mp4'});
                resolve(blob);
            });

            h264Stream.on('data', (data) => {
                segmenter.push(data);
            });

            h264Stream.on('done', () => {
                segmenter.flush();
            });

            let clusterTC = 0;

            for (const el of els) {
                if (el.EBML_ID === 'e7') {
                    clusterTC = el.value;
                }
                if (el.EBML_ID === 'a3') {
                    const trackNo = el.data[0] & 0x7F;
                    const tc = (el.data[1] << 8) | el.data[2];
                    const ts = clusterTC + tc;

                    videoTrack.id = trackNo;

                    h264Stream.push({
                        type: 'video',
                        trackId: trackNo,
                        data: new Uint8Array([0, 0, 1, 9, 240]),
                        pts: ts,
                        dts: ts,
                    });

                    h264Stream.push({
                        type: 'video',
                        pts: ts,
                        dts: ts,
                        trackId: trackNo,
                        data: el.data.slice(5),
                    });
                }
            }

            h264Stream.flush();
        });
    }
}
