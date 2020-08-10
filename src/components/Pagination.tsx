import PropTypes, { InferProps } from 'prop-types';
import React from 'react';

/**
 * The pagination component will display the page links, and will provide an onChange function
 * for the user to interact and notify the parent components.
 * @param {number} page
 * @param {number} total
 * @param {number} perPage
 * @param {function} onChange
 * @constructor
 */
export function Pagination({ page, total, perPage=20, onChange }: InferProps<typeof Pagination.propTypes>) {
  const pages = Math.abs(Math.ceil(total/perPage) || 1);

  /**
   * Will generate the links we need given the number of pages.
   * @param {number} page
   * @param {number} pages
   * @return {React.ReactNode[]}
   */
  const pageLinks = (page:number, pages:number) => {
    const items = [];
    for (let i=1; i<=pages; i++) {
      items.push(<li className={`page-item ${page === i ? 'active' : ''}`} aria-current="page" key={i}>
        <button className={'btn btn-link page-link'} onClick={() => onChange && onChange(i)}>
          {i} {page ===1 && <span className="sr-only">(current)</span>}
        </button>
      </li>);
    }
    return items;
  };

  return <nav>
    <ul className="pagination">
      <li className="page-item">
        <button className={'btn btn-link page-link'}
                tabIndex={-1}
                disabled={page <= 1}
                onClick={() => onChange && onChange(page-1)}>Previous</button>
      </li>
      {pageLinks(page, pages)}
      <li className="page-item">
        <button className={'btn btn-link page-link'}
                disabled={page >= pages}
                onClick={() => onChange && onChange(page+1)}>Next</button>
      </li>
    </ul>
  </nav>;
}

Pagination.defaultProps = {
  perPage: 20,
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Pagination;
