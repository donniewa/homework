import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import PropTypes, { InferProps } from 'prop-types';
import React, { useEffect, useState } from 'react';
import useOctokit from '../hooks/useOctokit';
import { groupBy, keys } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Commits({ owner, repo }: InferProps<typeof Commits.propTypes>) {
  const { data, request, error, loading } = useOctokit();
  const [ page, setPage ] = useState(1);
  const format = (date:string) => {
    try {
      return Intl.DateTimeFormat().format(new Date(date));
    } catch (e) {
      return false;
    }
  };
  const groups = data && groupBy(data, item => item?.commit?.author?.date?.substr(0,10));

  useEffect(() => {
    if (owner && repo) {
      request(`GET /repos/{owner}/{repo}/commits`, {
        owner, repo, page,
        per_page: 30,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner, repo, page]);

  return <div className={'Commits'}>
    {loading && <div className="progress">
      <div className="progress-bar progress-bar-striped progress-bar-animated"
           role="progressbar" aria-valuenow={100}
           aria-valuemin={0} aria-valuemax={100}
           style={{ width: '100%' }} />
    </div>}
    {error ? <div>There was an error loading the Commits. Please try again.</div> : null}
    {!error && groups && keys(groups).map(key => <div className={'media my-2'} key={key}>
      <FontAwesomeIcon icon={faCircleNotch} className={'mr-3 mt-1'} />
      <div className={'media-body'}>
        {format(key) && <h6>Commits on: {format(key)}</h6>}
        <ul className="list-group">
          {groups[key] && groups[key].map(commit =>
            (commit?.sha ? <li className="list-group-item" key={commit?.sha}>
              {commit?.commit?.message?.split('\n').map((item:string, key:number) => {
                return <React.Fragment key={key}>{item}<br/></React.Fragment>
              })}
              <div className={"mt-2"}>
                {commit?.author?.avatar && <img src={commit?.author?.avatar} width={25} alt={commit?.author?.name} className={'mr-2'} />}
                {!commit?.author?.avatar
                  && commit?.committer?.avatar_url
                  && <img src={commit?.committer?.avatar_url} width={25} alt={commit?.committer?.name} className={'mr-2'} />}
                <small>
                  <b className={'mr-2'}>{commit?.author?.login || commit?.commit?.author?.name}</b>
                  committed on: {format(commit?.commit?.author?.date)}
                </small>
              </div>
            </li> : null)
          )}
        </ul>
      </div>
    </div>)}
    {!error ? <div className={'btn-group'}>
      <button className={'btn btn-sm btn-outline-primary'} onClick={() => page > 1 && setPage(page-1)}>Previous Page</button>
      <button className={'btn btn-sm btn-outline-primary'} onClick={() => setPage(page+1)}>Next Page</button>
    </div> : null}
  </div>;
}
Commits.propTypes = {
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
};
export default Commits;
