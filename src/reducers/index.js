import { PAGE_TYPE_SEND, STORAGE_DATA_SEND } from '../actions/ActionTypes';

const initialState = {
    page: "home",
    words: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case PAGE_TYPE_SEND:
            return {
                page: action.pageName
            };

        case STORAGE_DATA_SEND:
            return {
                words: action.storageWords
            };

        default:
            return state;
    };
};
