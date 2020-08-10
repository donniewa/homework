import React from 'react';
import ReactDOM from 'react-dom';
import { Octokit } from '@octokit/rest';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Api from './context/Api';

const octokit = new Octokit();
ReactDOM.render(
  <React.StrictMode>
    <Api.Provider value={octokit}>
      <App />
    </Api.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
