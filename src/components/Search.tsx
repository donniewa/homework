import PropTypes, { InferProps } from 'prop-types';
import React from 'react';
import { debounce, get } from 'lodash';

export function Search(
  {
    results, onChange, onSelect, onFocus, label, placeholder, loading, bindLabel, children, show
  }: InferProps<typeof Search.propTypes>) {
  const change = debounce((value) => onChange && onChange(value), 500);
  const select = (value:any) => {
    onSelect && onSelect(value)
  };

  return <div className={'Search'} title={'search utility'}>
    <div className="dropdown">
      <div className="form-group">
        <label htmlFor="searchElement">{label}</label>
        <input type="text" className="form-control" id="searchElement" placeholder={placeholder}
               onChange={e => change(e.target.value)}
               onFocus={(e) => onFocus && onFocus(e)}
        />
      </div>
      <div className={`dropdown-menu ${show ? 'show' : ''}`} aria-labelledby="searchElement">
        {children}
        {loading ? <div className="spinner-border text-primary m-2" role="status">
            <span className="sr-only">Loading...</span>
        </div> : null}
        {results ? results.map(result =>
          <button key={result.id} className="dropdown-item" type="button" onClick={() => select(result)}>
            {get(result, bindLabel)}
          </button>
        ) : null}
      </div>
    </div>
  </div>;
}
Search.defaultProps = {
  results: [],
  label: 'Search',
  bindLabel: 'name',
  placeholder: 'Search for Repositories',
  loading: false,
  show: false,
};
Search.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onFocus: PropTypes.func,
  label: PropTypes.string.isRequired,
  bindLabel: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  show: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
  }).isRequired).isRequired,
};

export default Search;
