import React, { Component, ReactNode } from 'react';
import ErrorIndicator from './ErrorIndicator';

interface ErrorBoundaryProps {
  children?: ReactNode;
  error?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps, ErrorBoundaryState
> {
  constructor(props: {
    error: boolean;
    children: JSX.Element;
  }) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError(): ErrorBoundaryState {
    return ({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    const { error = false, children } = this.props;

    if (hasError || error) {
      return (<ErrorIndicator />);
    }
    return children;
  }
}
