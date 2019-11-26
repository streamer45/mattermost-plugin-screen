import {closeRecordingModal} from 'actions';
import {isRecordingModalVisible} from 'selectors';

import Root from './root';

const connect = window.ReactRedux.connect;
const bindActionCreators = window.Redux.bindActionCreators;

const mapStateToProps = (state) => ({
    visible: isRecordingModalVisible(state),
    channelId: state.entities.channels.currentChannelId,
    userId: state.entities.users.currentUserId,
    rootId: state.views.rhs.selectedPostId,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    close: closeRecordingModal,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Root);
