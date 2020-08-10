import React, { useEffect, useState } from 'react';
import Organization from './components/Organization';
import Search from './components/Search';
import useOctokit from './hooks/useOctokit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { get } from 'lodash';

/**
 * Main application, will start by showing a search bar on the page.
 * @constructor
 */
function App() {
  const { data, request:search, error, loading } = useOctokit();
  const [ searchTerm, setSearch ] = useState<string>('');
  const [ org, setOrg ] = useState<any>(null);
  const [ show, setShow ] = useState(false);

  const select = (result: any) => {
    setShow(false);
    setOrg(result.login);
  };

  /**
   * When the search term changes we'll immediately call the api to load.
   * The Search Field has an automatic Debounce of 500 ms, so the API will
   * not need to be debounced here.
   */
  useEffect(() => {
    if (searchTerm.trim()) {
      search('GET /search/users', { q: `${searchTerm}+type:org` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="navbar-brand">
          <FontAwesomeIcon icon={faGithub} size={'lg'} className={'mx-2'} /> GitHub Search
        </div>
      </nav>
      <div className="container p-4">
        {/* SEARCH */}
        <Search onChange={(e) => setSearch(e)}
                placeholder={'Search for Organizations'}
                show={loading || (show && data?.items?.length>0)}
                onFocus={() => setShow(true)}
        >
          {/* Display a loading spinner inside the search results area if we're actively searching */}
          {loading && <div className="spinner-border text-primary m-2" role="status">
            <span className="sr-only">Loading...</span>
          </div>}

          {/* display a listing of the results */}
          {data?.items && data.items.map((result: any) =>
            <button key={result.id} className="dropdown-item" type="button" onClick={() => select(result)}>
              <FontAwesomeIcon icon={result.type === 'Organization' ? faBuilding : faUser } className={'mr-2'} />
              {get(result, 'login')}
            </button>
          )}
        </Search>
        {error && <div>There was an error loading the search results. Please try again.</div>}

        {/* List the Chosen Result */}
        {org && <Organization name={org} />}
      </div>
    </div>
  );
}

export default App;
