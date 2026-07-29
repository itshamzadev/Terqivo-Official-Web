import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-background text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-semibold mb-4 text-foreground tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            An unexpected error occurred. Our engineering team has been notified.
            Please try refreshing the page or navigating back home.
          </p>
          <div className="flex gap-4">
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-secondary text-foreground rounded-full font-medium text-sm hover:bg-secondary/80 transition-all flex items-center gap-2"
            >
              <RefreshCw size={16} /> Refresh Page
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-primary/90 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
