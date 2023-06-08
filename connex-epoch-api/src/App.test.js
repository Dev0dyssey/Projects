import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  test('renders server time when time is loaded', () => {
    const serverTime = 1629300000;
    const formattedTime = '12:00:00';
    render(<App serverTime={serverTime} serverStandardTime={formattedTime} />);
    const serverTimeRegex = new RegExp(formattedTime, 'i');
    const serverTimeElement = screen.getByText(serverTimeRegex);
    expect(serverTimeElement).toBeInTheDocument();
  });

  test('renders time difference when time is loaded', () => {
    const serverTime = 1629300000;
    const formattedTime = '12:00:00';
    render(<App serverTime={serverTime} serverStandardTime={formattedTime} />);
    const timeDifferenceElement = screen.getByText(/time difference/i);
    expect(timeDifferenceElement).toBeInTheDocument();
  });

  test('renders loading message when time is loading', () => {
    render(<App loadingTime={true} />);
    const loadingMessage = screen.getByText(/loading time/i);
    expect(loadingMessage).toBeInTheDocument();
  });

  test('renders loading message when metrics are loading', () => {
    render(<App loadingMetrics={true} />);
    const loadingMessage = screen.getByText(/loading metrics/i);
    expect(loadingMessage).toBeInTheDocument();
  });

  test('renders metrics when metrics are loaded', () => {
    const metrics = 'Metric 1: 10\nMetric 2: 20';
    render(<App metrics={metrics} />);
    const metricsElement = screen.getByText(metrics);
    expect(metricsElement).toBeInTheDocument();
  });
});