import { act, renderHook } from '@testing-library/react-hooks';
import useFetcher from './use-fetcher';

describe('useFetcher', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useFetcher());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
