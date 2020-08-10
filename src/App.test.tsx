import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders App', () => {
  const { getByTitle } = render(<App />);
  const searchEl = getByTitle('search utility');

  expect(searchEl).toBeInTheDocument();
  expect(() => getByTitle('repository list')).toThrow();
});
