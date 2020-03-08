import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { loadState, updateDownloadsProgressPeriodically } from './thunks';
import './App.css';
import { blue } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { saveState } from './utilities';
import DownloadPage from './components/DownloadPage';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue['700']
    }
  }
});

function App() {
  const [loaded, setLoaded] = useState(false);
  const state = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.removeAllListeners('before-close');
    ipcRenderer.on('before-close', async () => {
      await saveState(state);
      ipcRenderer.send('saved', null);
    });
  }, [state]);

  useEffect(() => {
    if (!loaded) {
      dispatch(loadState()).then(() => {
        setLoaded(true);
        dispatch(updateDownloadsProgressPeriodically());
        ipcRenderer.send('react-loaded', null);
      });
    }
  }, [loaded, dispatch]);

  return loaded ? (
    <ThemeProvider theme={theme}>
      <DownloadPage />
    </ThemeProvider>
  ) : null;
}

export default App;
