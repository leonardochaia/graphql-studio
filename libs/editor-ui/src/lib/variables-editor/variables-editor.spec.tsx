import { render } from '@testing-library/react';

import VariablesEditor from './variables-editor';

describe('VariablesEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VariablesEditor />);
    expect(baseElement).toBeTruthy();
  });
});
