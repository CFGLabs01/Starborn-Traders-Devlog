import React from 'react';

class CharacterModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CharacterModelErrorBoundary] Error loading character model:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-tiffany_blue mb-2">Model Loading Error</h3>
            <p className="text-sm text-slate-400">
              Unable to load 3D character model.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CharacterModelErrorBoundary; 