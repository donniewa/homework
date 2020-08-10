import React, { useEffect, useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from './Pagination';
import useOctokit from '../hooks/useOctokit';
import { orderBy } from 'lodash';
import { faBalanceScale, faCodeBranch, faExclamationCircle, faEye, faStar } from '@fortawesome/free-solid-svg-icons';

const textForOrder = new Map([
  ['forks_count', 'number of forks'],
  ['stargazers_count', 'number of stars'],
  ['watchers_count', 'number of watchers'],
  ['open_issues_count', 'number of open issues'],
]);

/**
 * The Repo (Repository) list component will list out all of the repositories for the given org name
 * @param {string} org
 * @param {number} total
 * @param {function} onSelect
 * @constructor
 */
export function RepoList({ org, total, onSelect }: InferProps<typeof RepoList.propTypes>) {
  const { data, paginate, error, loading } = useOctokit();
  const [ orderByProp, setOrderBy ] = useState('forks_count');
  const [ order, setOrder ] = useState<boolean | 'desc' | 'asc'>('desc');
  const [ page, setPage ] = useState(1);
  const [ show, setShow ] = useState(false);
  const format = new Intl.NumberFormat().format;
  const itemsPerPage = 20;

  const setOrderHandler = (o:string) => {
    setShow(false);
    if (orderByProp === o) {
      setOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    }
    setOrderBy(o);
  };

  useEffect(() => {
    if (org) {
      paginate(`GET /orgs/{org}/repos`, { org });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org]);

  return <div className={'RepoList'} title={'repository list'}>
    <div className={'d-flex flex-row'}>
      <div className={'flex-grow-1'}>
        <h5 className={'mt-3'}>Repositories</h5>
        {textForOrder.get(orderByProp) ? <small className={'m-2'}>ordered by {textForOrder.get(orderByProp)}</small> : null}
        <small className={'m-2 d-inline-flex'}>page {page} of {Math.ceil(total / itemsPerPage) || 1}</small>
      </div>
      <div className="dropdown align-self-baseline">
        <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="sortBy"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                onClick={() => setShow(true)}>
          Sort By
        </button>
        <div className={`dropdown-menu dropdown-menu-right ${show ? 'show' : ''}`} aria-labelledby="sortBy">
          <button className="dropdown-item" onClick={() => setOrderHandler('forks_count')}>Number of Forks</button>
          <button className="dropdown-item" onClick={() => setOrderHandler('stargazers_count')}>Number of Stars</button>
          <button className="dropdown-item" onClick={() => setOrderHandler('watchers_count')}>Number of Watchers</button>
          <button className="dropdown-item" onClick={() => setOrderHandler('open_issues_count')}>Number of Issues</button>
        </div>
      </div>
    </div>
    {loading ? <div className="progress">
      <div className="progress-bar progress-bar-striped progress-bar-animated"
           role="progressbar" aria-valuenow={100}
           aria-valuemin={0} aria-valuemax={100}
           style={{ width: '100%' }} />
    </div> : null}
    {error ? <div>There was an error loading the repositories. Please try again.</div> : null}
    <div className="list-group">
      {data ? orderBy(data, orderByProp, order)
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((repo) =>
            repo.id ? <div key={repo.id} className="list-group-item list-group-item-action" onClick={() => onSelect && onSelect(repo)}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1 text-primary">{repo.name}</h5>
                <small>{repo.full_name}</small>
              </div>
              <p className="mb-1">{repo.description}</p>
              <div className={'d-flex flex-row'}>
                {repo?.license?.name && <small className={'mr-2'}><FontAwesomeIcon icon={faBalanceScale} /> {repo.license.name}</small>}
                <small className={'mr-2'}><FontAwesomeIcon icon={faCodeBranch} /> {format(repo.forks_count)}</small>
                <small className={'mr-2'}><FontAwesomeIcon icon={faStar} /> {format(repo.stargazers_count)}</small>
                <small className={'mr-2'}><FontAwesomeIcon icon={faEye} /> {format(repo.watchers_count)}</small>
                <small className={'mr-2'}><FontAwesomeIcon icon={faExclamationCircle} /> {format(repo.open_issues_count)}</small>
              </div>
            </div> : null
        ) : null}
      {total ? <Pagination page={page} perPage={itemsPerPage} onChange={(p:number) => setPage(p)} total={total} /> : null}
    </div>
  </div>;
}
RepoList.propTypes = {
  org: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  onSelect: PropTypes.func,
};

export default RepoList;
