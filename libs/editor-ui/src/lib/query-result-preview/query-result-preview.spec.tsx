import { render } from '@testing-library/react';

import QueryResultPreview from './query-result-preview';

describe('QueryResultPreview', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QueryResultPreview />);
    expect(baseElement).toBeTruthy();
  });
});
