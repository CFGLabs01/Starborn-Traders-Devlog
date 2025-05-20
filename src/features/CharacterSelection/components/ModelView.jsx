// Component: ModelView
// Purpose: Displays the character's 3D model preview.
import React from 'react';
// Import the refactored preview content component
import { CharacterPreviewContent } from '../../../components/CharacterModelViewer/CharacterModelViewer';

const ModelView = ({ previewHostRef }) => {
  // This component primarily defines the placeholder area for the modal's 3D view.
  // The actual rendering is handled by App.jsx <View /> which renders CharacterPreviewContent.
  // However, CharacterPopup imports *this* component, so we need it to exist,
  // but it doesn't render the 3D content itself anymore.
  // The essential part is providing a container for the previewHostRef passed down to CharacterPopup.
  
  // NOTE: This component itself doesn't receive previewHostRef directly.
  // CharacterPopup receives it and should render the target div.
  // ModelView now just returns null or a placeholder as the <View> in App.jsx handles the rendering.
  
  // Render a visible placeholder for debugging/layout
  return (
    <div
      ref={previewHostRef}
      className="w-full lg:w-[45%] h-[400px] relative"
      style={{ minHeight: '300px' }}
    />
  );
};

export default ModelView; 