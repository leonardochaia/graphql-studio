import { act, renderHook } from '@testing-library/react-hooks';
import useSchema from './use-schema';

describe('useSchema', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useSchema());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
