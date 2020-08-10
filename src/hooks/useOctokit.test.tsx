import { renderHook } from '@testing-library/react-hooks'
import { act } from "react-test-renderer";

import { useOctokit } from '../hooks/useOctokit';

jest.mock('@octokit/rest', () => {
  return {
    __esModule: true,
    Octokit: jest.fn().mockImplementation(() => ({ request: jest.fn().mockResolvedValue({ returnedData: 'foo' }) }))
  };
}, {virtual: true});

describe('Use Fetch Hook', () => {
  beforeAll(() => {
    jest.resetModules();
  });

  it('will return the expected data on load', async () => {
    const { result } = renderHook(() => useOctokit());
    const { data, error, loading } = result.current;

    expect(error).toBe(false);
    expect(loading).toBe(false);
    expect(data).toBe(null);

    await act(async () => {
      await result.current.request("GET /test-url");
    });

    expect(result.current.data).toEqual({ returnedData: "foo" });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(false);
  });
});
