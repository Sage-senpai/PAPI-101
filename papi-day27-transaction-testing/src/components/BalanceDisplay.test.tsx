import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BalanceDisplay } from './BalanceDisplay';
import * as useChainDataModule from '../hooks/useChainData';

// Mock the entire hook module
jest.mock('../hooks/useChainData');

describe('BalanceDisplay Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders balance correctly formatted', () => {
    jest.spyOn(useChainDataModule, 'useBalance').mockReturnValue({
      data: 25000000000n,
      isLoading: false,
      error: null,
    });

    render(<BalanceDisplay address="5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" />);
    
    expect(screen.getByText(/250\.00000000/)).toBeInTheDocument();
    expect(screen.getByText('DOT')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    jest.spyOn(useChainDataModule, 'useBalance').mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<BalanceDisplay address="5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" />);
    
    expect(screen.getByText('Loading balance...')).toBeInTheDocument();
  });

  it('handles error state', () => {
    jest.spyOn(useChainDataModule, 'useBalance').mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Failed to fetch balance',
    });

    render(<BalanceDisplay address="5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" />);
    
    expect(screen.getByText('Error: Failed to fetch balance')).toBeInTheDocument();
  });
});