import { faArrowAltCircleLeft, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import PropTypes, { InferProps } from 'prop-types';
import React, { useEffect, useState } from 'react';
import useOctokit from '../hooks/useOctokit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RepoList } from './RepoList';
import Commits from './Commits';

/**
 * The organization component will display basic infomation about a given organization name
 * @param {string} name
 * @constructor
 */
export function Organization({ name }: InferProps<typeof Organization.propTypes>) {
  const { data:org, request, error, loading } = useOctokit();
  const [ repo, setRepo ] = useState<any>(null);

  /**
   * when the name changes, we'll have to reload the request
   */
  useEffect(() => {
    setRepo(null);
    if (name) {
      request('GET /orgs/{org}', { org: name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return <div className={'Organization'}>
    {loading ? <div className="progress">
      <div className="progress-bar progress-bar-striped progress-bar-animated"
           role="progressbar" aria-valuenow={100}
           aria-valuemin={0} aria-valuemax={100}
           style={{ width: '100%' }} />
    </div> : null}
    {error ? <div>There was an error loading the organization. Please try again.</div> : null}
    {org ? <div className="media">
      {org.avatar_url && <img src={org.avatar_url} className="mr-3" alt={`${org.login}- avatar`} style={{maxWidth: 150}} />}
      {!org.avatar_url && org.gravatar_id && <img src={org.gravatar_id} className="mr-3" alt={`${org.login}- gravatar`} style={{maxWidth: 150}} />}
      <div className="media-body">
        <h5 className="mt-0">{org?.name}</h5>
        {org?.description}
        {org?.location ? <div>
          <small><FontAwesomeIcon icon={faMapMarkerAlt} className={'mr-2'} /> {org.location}</small>
        </div> : null}

        {/* Repository Listing */}
        {org?.public_repos > 0 && org.repos_url && !repo
          ? <RepoList org={name} total={org?.public_repos || 0} onSelect={(r) => setRepo(r)} />
          : null}
        {org?.public_repos <= 0 ? <h5 className={'mt-3'}>No Repositories</h5> : null}

        {/* The Repo is chosen */}
        {repo ? <div>
          <button className={'btn btn-sm btn-outline-primary m-4'} onClick={() => setRepo(null)}>
            <FontAwesomeIcon icon={faArrowAltCircleLeft} className={'mr-2'} /> Back to listing
          </button>
          <h5>{repo.name}</h5>

          {/* List the commits */}
          <Commits owner={name} repo={repo?.name} />
        </div> : null}
      </div>
    </div> : null}
  </div>;
}
Organization.propTypes = {
  name: PropTypes.string.isRequired,
};
export default Organization;
