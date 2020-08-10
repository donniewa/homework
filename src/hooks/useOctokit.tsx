import { useState, useContext } from 'react';
import { Octokit } from '@octokit/rest';
import Api from '../context/Api';

/**
 * Will fetch the given url and return a JSON payload. using the OctoKit Api from github:
 * @link https://octokit.github.io/rest.js/v18#usage
 */
export function useOctokit() {
  const octokit:Octokit       = useContext(Api);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(false);
  const [data,    setData]    = useState<any>(null);

  /**
   * Shortcut for the paginate Api
   * @link https://octokit.github.io/rest.js/v18#pagination
   */
  const paginate = async (route:any, options?:any) => request(route, options, octokit.paginate);

  /**
   * Requests the route given with the options
   * @link https://octokit.github.io/rest.js/v18#custom-requests
   */
  const request = async (route:any, options?:any, fn:any=octokit.request) => {
    let response;
    setLoading(true);
    setError(false);
    try {
      response = await fn(route, options);
      setData(response?.data || response);
    } catch (error) {
      setData({ status: error.message });
      setError(true);
    }
    setLoading(false);
    return response;
  };

  return { data, error, loading, request, paginate };
}

export default useOctokit;
