import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in h-[50vh]">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md">
            We encountered an unexpected error. You can try refreshing the page or navigating to another section.
          </p>
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = "/";
            }}
          >
            Go Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
