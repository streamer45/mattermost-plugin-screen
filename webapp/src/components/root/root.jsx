const React = window.React;
const PropTypes = window.PropTypes;

import {FormattedMessage} from 'react-intl';

import Client from '../../client/client';

function pad2(n) {
    const val = n | 0;
    return val < 10 ? `0${val}` : `${Math.min(val, 99)}`;
}

function pad2nozero(n) {
    const val = n | 0;
    return val < 10 ? `${val}` : `${Math.min(val, 99)}`;
}

export default class Root extends React.Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        close: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired,
        channelId: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        rootId: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
            duration: 0,
            started: false,
            client: new Client(),
            recording: null,
            uploading: false,
            filename: 'screenrec.mp4',
        };

        document.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape') {
                if (this.state.uploading) {
                    this.state.client.cancelUpload();
                }
            }
        });
    }

    componentDidUpdate(prevProps) {
        const client = this.state.client;
        if (this.props.visible && this.props.visible !== prevProps.visible && !this.state.started) {
            client.startRecording().catch(() => {
                this.onCancel();
            });
            client.on('update', (time) => {
                this.setState({duration: time});
            });
            client.on('stop', () => {
                this.setState({started: false, duration: 0});
            });
            client.on('data', (data) => {
                this.setState({recording: URL.createObjectURL(data)});
            });
            this.setState({started: true});
        }
    }

    getDuration() {
        const msecs = this.state.duration;
        const secs = Math.round(msecs / 1000);
        return pad2nozero(secs / 60) + ':' + pad2(secs % 60);
    }

  onStop = () => {
      if (this.state.started) {
          this.setState({started: false, duration: 0});
          this.state.client.stopRecording();
      }
  }

  onCancel = () => {
      this.setState({recording: null});
      if (this.state.started) {
          this.state.client.cancelRecording();
          this.setState({started: false, duration: 0});
      }
      this.props.close();
  }

  onCancelUpload = () => {
      this.setState({uploading: false});
  }

  onSend = async () => {
      this.setState({uploading: true});
      try {
          await this.state.client.uploadRecording(this.state.filename, this.props.channelId, this.props.userId, this.props.rootId);
      } catch (err) {
          // TODO: add some informative error message to the dialog.
          this.setState({uploading: false});
          return;
      }
      this.setState({uploading: false, recording: null});
      this.props.close();
  }

  onFilenameChange = (ev) => {
      this.setState({filename: ev.target.value});
  }

  render() {
      if (!this.props.visible) {
          return null;
      }

      const style = getStyle(this.props.theme);

      if (this.state.uploading) {
          return (
              <div style={style.root}>
                  <div style={style.rec}>
                      <FormattedMessage
                          id='modal.uploading'
                          defaultMessage='Uploading...'
                      />
                      <div>
                          <button
                              style={style.button}
                              onClick={this.onCancelUpload}
                              className='btn btn-danger'
                          >
                              <FormattedMessage
                                  id='modal.cancel'
                                  defaultMessage='Cancel'
                              />
                          </button>
                      </div>
                  </div>
              </div>
          );
      }

      if (!this.state.recording) {
          return (
              <div style={style.root}>
                  <div style={style.rec}>
                      <span style={style.duration}>{this.getDuration()}</span>
                      <div>
                          <button
                              onClick={this.onStop}
                              style={style.button}
                              className='btn btn-primary'
                          >
                              <FormattedMessage
                                  id='modal.stop'
                                  defaultMessage='Stop'
                              />
                          </button>
                          <button
                              style={style.button}
                              onClick={this.onCancel}
                              className='btn btn-danger'
                          >
                              <FormattedMessage
                                  id='modal.cancel'
                                  defaultMessage='Cancel'
                              />
                          </button>
                      </div>
                  </div>
              </div>
          );
      }
      return (
          <div style={style.root}>
              <div style={style.rec}>
                  <video
                      style={style.video}
                      playsInline='playsinline'
                      controls='controls'
                      src={this.state.recording}
                  />
                  <div style={style.input}>
                      <label>
                          <FormattedMessage
                              id='modal.filename'
                              defaultMessage='Filename'
                          />
                      </label>
                      <input
                          type='text'
                          value={this.state.filename}
                          onChange={this.onFilenameChange}
                      />
                  </div>
                  <div>
                      <button
                          onClick={this.onSend}
                          style={style.button}
                          className='btn btn-primary'
                      >
                          <FormattedMessage
                              id='modal.upload'
                              defaultMessage='Upload'
                          />
                      </button>
                      <button
                          style={style.button}
                          onClick={this.onCancel}
                          className='btn btn-danger'
                      >
                          <FormattedMessage
                              id='modal.cancel'
                              defaultMessage='Cancel'
                          />
                      </button>
                  </div>
              </div>
          </div>
      );
  }
}

const getStyle = (theme) => ({
    root: {
        position: 'absolute',
        display: 'flex',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    rec: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5em',
        backgroundColor: theme.centerChannelBg,
        color: theme.centerChannelColor,

        // border: `1px solid ${changeOpacity(theme.centerChannelColor, 0.1)}`,
    },
    input: {
        display: 'flex',
        flexDirection: 'column',
        margin: '0.5em',
    },
    button: {
        margin: '0.5em',
    },
    icon: {
        color: 'red',
        padding: '0.5em',
    },
    duration: {
        padding: '0.5em',
        fontSize: '1.5em',
    },
    video: {
        width: '640px',
    },
});
