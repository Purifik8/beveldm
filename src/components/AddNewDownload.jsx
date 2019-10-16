import React, { createRef } from 'react';
import { connect } from 'react-redux';
import request from 'request';
import { addNewDownload } from '../actions';
import { ipcRenderer } from 'electron';
import path from 'path';
import { fsExistsPromise } from '../promisified';

function AddNewDownload({ onAdd = () => { } }) {
  const url = createRef();
  const filePath = createRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(url.current.value, filePath.current.value);
    url.current.value = null;
    filePath.current.value = null;
  };

  const chooseFile = () => {
    ipcRenderer.send('choose-file');
    ipcRenderer.on('choosen-file', (_event, args) => {
      filePath.current.value = args;
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="file" type="text" placeholder="Save path" ref={filePath} />
        <button type="button" onClick={chooseFile}>Choose file</button>
        <br />
        <input name="url" type="text" placeholder="Enter url" ref={url} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

function getFileName(headers) {
  const regex = /filename=(.+)/i;
  const MATCH_INDEX = 1;
  const matchArray = headers['content-disposition'].match(regex);
  return matchArray[MATCH_INDEX];
}

function getFileSize(headers) {
  return parseInt(headers['content-length']);
}

async function getAvailableFileName(dirname, filename, downloads) {
  const extension = path.extname(filename);
  let fullPath = path.resolve(dirname, filename);
  let nameWithoutExtension = filename.replace(extension, '');
  let suffix = 0;
  let availableFilename;
  while (await fsExistsPromise(fullPath)) {
    suffix++;
    availableFilename = `${nameWithoutExtension} (${suffix})${extension}`;
    fullPath = path.resolve(dirname, availableFilename);
  }
  downloads.forEach(download => {
    const downloadPath = path.resolve(download.dirname, download.filename);
    if (downloadPath === fullPath) {
      suffix++;
      availableFilename = `${nameWithoutExtension} (${suffix})${extension}`;
      fullPath = path.resolve(dirname, availableFilename);
    }
  });
  return availableFilename;
}

let downloads;
export default connect(
  state => { 
    downloads = state.downloads;
    return {};
  },
  dispatch => ({
    onAdd: (url, dirname) => {
      request.get(url)
        .on('response', async res => {
          dispatch(
            addNewDownload(
              url,
              dirname,
              await getAvailableFileName(dirname, getFileName(res.headers), downloads),
              getFileSize(res.headers)
            )
          );
        });
    }
  })
)(AddNewDownload);
