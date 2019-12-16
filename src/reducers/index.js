import {
  ADD_NEW_DOWNLOAD,
  UPDATE_BYTES_DOWNLOADED,
  CHANGE_DOWNLOAD_URL,
  CHANGE_DOWNLOAD_BASIC_INFO,
  REMOVE_DOWNLOAD,
  SET_INTERVAL,
  SUBSCRIBE_TO_INTERVAL,
  UNSUBSCRIBE_FROM_INTERVAL,
  SET_DOWNLOAD_RES,
  NOTIFY,
  TOGGLE_SAVE_DATA,
  SET_DOWNLOAD_SHOW,
  SET_DOWNLOAD_ERROR,
  CHANGE_DOWNLOAD_STATUS
} from '../actions';

export function downloads(state = [], action) {
  switch (action.type) {
    case ADD_NEW_DOWNLOAD:
      return [
        {
          id: action.id,
          url: action.url,
          dirname: action.dirname,
          status: action.status
        },
        ...state
      ];
    case UPDATE_BYTES_DOWNLOADED:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              bytesDownloaded: action.bytesDownloaded
            }
          : download
      );
    case CHANGE_DOWNLOAD_STATUS:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              status: action.status
            }
          : download
      );
    case REMOVE_DOWNLOAD:
      return state.filter(download => download.id !== action.id);
    case CHANGE_DOWNLOAD_URL:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              url: action.newUrl,
              res: action.res
            }
          : download
      );
    case CHANGE_DOWNLOAD_BASIC_INFO:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              defaultFilename: action.defaultFilename,
              availableFilename: action.availableFilename,
              size: action.size,
              resumable: action.resumable
            }
          : download
      );
    case SET_DOWNLOAD_ERROR:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              error: action.error
            }
          : download
      );
    case SET_DOWNLOAD_RES:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              res: action.res
            }
          : download
      );
    case SET_DOWNLOAD_SHOW:
      return state.map(download =>
        download.id === action.id
          ? {
              ...download,
              show: action.show
            }
          : download
      );
    default:
      return state;
  }
}

export function interval(state = null, action) {
  switch (action.type) {
    case SET_INTERVAL:
      return action.interval;
    default:
      return state;
  }
}

export function intervalSubscribers(state = [], action) {
  switch (action.type) {
    case SUBSCRIBE_TO_INTERVAL:
      return [...state, { id: action.id, action: action.action }];
    case UNSUBSCRIBE_FROM_INTERVAL:
      return state.filter(subscriber => subscriber.id !== action.id);
    default:
      return state;
  }
}

export function currentNotification(state = {}, action) {
  switch (action.type) {
    case NOTIFY:
      return {
        variant: action.variant,
        message: action.message,
        actionName: action.actionName,
        action: action.action
      };
    default:
      return state;
  }
}

export function settings(state = {}, action) {
  switch (action.type) {
    case TOGGLE_SAVE_DATA:
      return {
        ...state,
        saveData: action.value
      };
    default:
      return state;
  }
}
