import React from 'react';
import { render } from '@testing-library/react';
import Component from './RepoList';

const mockRequest = jest.fn();

jest.mock('../hooks/useOctokit', () => ({
  __esModule: true,
  default: function() {
    return {
      data: jest.fn(),
      paginate: mockRequest,
    };
  },
}));
test('RepoList render & Paginate call', () => {
  const { getByText } = render(<Component org={'test-org'} total={10} />);
  expect(() => getByText('error')).toThrow();
  expect(mockRequest).toHaveBeenCalledWith(`GET /orgs/{org}/repos`, { org: 'test-org' });
});
