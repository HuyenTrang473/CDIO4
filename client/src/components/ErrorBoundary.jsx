import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("🔴 ERROR CAUGHT:", error);
        console.error("Stack:", errorInfo.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', margin: '20px', background: '#fee', border: '2px solid #f00', borderRadius: '8px' }}>
                    <h2 style={{ color: '#c00' }}>❌ Lỗi Component</h2>
                    <details style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px' }}>
                        {this.state.error && this.state.error.toString()}
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
