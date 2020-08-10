import { compileUrl } from './misc';

describe('Miscellaneous Library Tests', () => {
  describe('compileUrl method', () => {
    it('will return the expected urls', () => {
      expect(compileUrl('test-url')).toEqual('test-url');
      expect(compileUrl('http://test-url.com')).toEqual('http://test-url.com');
      expect(compileUrl('http://test-url.com?a=1')).toEqual('http://test-url.com?a=1');
      expect(compileUrl('http://test-url.com?a=1&b=2')).toEqual('http://test-url.com?a=1&b=2');
      expect(compileUrl('http://test-url.com', { a: 1 })).toEqual('http://test-url.com?a=1');
      expect(compileUrl('http://test-url.com', { a: 1, b: 2 })).toEqual('http://test-url.com?a=1&b=2');
    });
    it('will return encode the urls', () => {
      expect(compileUrl('test-url')).toEqual('test-url');
      expect(compileUrl('http://test-url.com?i am spaced out')).toEqual('http://test-url.com?i%20am%20spaced%20out');
    });
  });
});
