import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false });
    };

    handleGoHome = () => {
        this.setState({ hasError: false });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen w-screen gap-4">
                    <h1 className="text-2xl font-semibold">Something went wrong</h1>
                    <p className="text-gray-500">An unexpected error occurred.</p>
                    <div className="flex gap-3">
                        <button
                            onClick={this.handleRetry}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={this.handleGoHome}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary
