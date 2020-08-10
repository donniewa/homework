import React from 'react';
import { render } from '@testing-library/react';
import Component from './Commits';

const mockRequest = jest.fn();

jest.mock('../hooks/useOctokit', () => ({
  __esModule: true,
  default: function() {
    return {
      data: jest.fn(),
      request: mockRequest,
    };
  },
}));
test('Commits render & call the request', () => {
  const { getByText } = render(<Component owner={'test'} repo={'test-repo'} />);
  expect(() => getByText('error')).toThrow();
  expect(mockRequest).toHaveBeenCalledWith(
    `GET /repos/{owner}/{repo}/commits`,
    {"owner": "test", "page": 1, "per_page": 30, "repo": "test-repo"}
  );
});
