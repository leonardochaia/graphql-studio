import { render } from '@testing-library/react';

import QueryEditor from './query-editor';

describe('QueryEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QueryEditor />);
    expect(baseElement).toBeTruthy();
  });
});
