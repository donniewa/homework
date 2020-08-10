import React from 'react';
import { render } from '@testing-library/react';
import Component from './Organization';

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
test('Organization render', () => {
  const { getByText } = render(<Component name={'test-org'} />);
  expect(() => getByText('error')).toThrow();
  expect(mockRequest).toHaveBeenCalledWith(`GET /orgs/{org}`, { org: 'test-org' });
});
