import {FormattedMessage} from 'react-intl';

import en from '../i18n/en.json';

import {isRecordingSupported} from './client';
import Root from './components/root';
import reducer from './reducer';
import {openRecordingModal} from './actions';

function getTranslations(locale) {
    switch (locale) {
    case 'en':
        return en;
    }
    return {};
}

export default class ScreenPlugin {
    initialize(registry, store) {
        if (!isRecordingSupported()) {
            return;
        }

        registry.registerFileUploadMethod(
            <i className='icon fa fa-desktop'/>,
            () => {
                store.dispatch(openRecordingModal());
            },
            <FormattedMessage
                id='plugin.recording'
                defaultMessage='Screen recording'
            />,
        );

        registry.registerReducer(reducer);
        registry.registerRootComponent(Root);
        registry.registerTranslations(getTranslations);
    }
}
