import { Octokit } from '@octokit/rest';
import React from 'react';
const Api = React.createContext<Octokit>(new Octokit());
export default Api;
