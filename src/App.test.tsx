import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  //const { getByText } = render(<App />);
  let r = render(<App />);

  const e = r.getByTitle(/Board/)
  expect(e).toBeInTheDocument();
});
