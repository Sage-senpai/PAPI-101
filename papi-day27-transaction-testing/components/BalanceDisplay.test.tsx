import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BalanceDisplay } from './BalanceDisplay';

// Mock PAPI hook
jest.mock('../hooks/useChainData', () => ({
  useBalance: () => ({
    data: 25000000000n,
    isLoading: false,
    error: null,
  }),
}));

describe('BalanceDisplay Component', () => {
  it('renders balance correctly formatted', () => {
    render(<BalanceDisplay address="5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" />);
    
    expect(screen.getByText(/250\.0000000/)).toBeInTheDocument();
    expect(screen.getByText('DOT')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    // Override mock for this test
    jest.spyOn(require('../hooks/useChainData'), 'useBalance')
      .mockImplementation(() => ({
        data: null,
        isLoading: true,
        error: null,
      }));

    render(<BalanceDisplay address="5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" />);
    
    expect(screen.getByText('Loading balance...')).toBeInTheDocument();
  });

  it('handles error state', () => {
    jest.spyOn(require('../hooks/useChainData'), 'useBalance')
      .mockImplementation(() => ({
        data: null,
        isLoading: false,
        error: 'Failed to fetch balance',
      }));

    render(<BalanceDisplay address="5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" />);
    
    expect(screen.getByText('Error: Failed to fetch balance')).toBeInTheDocument();
  });
});