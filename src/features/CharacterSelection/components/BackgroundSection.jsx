// Component: BackgroundSection
// Purpose: Displays the character's bio, faction, and origin information.
import React from 'react';

const BackgroundSection = ({ shortBio, longBio, faction, origin, className = '' }) => {
  return (
    // Background Section - Apply passed className, remove hardcoded background
    <div className={className}>
      <h3 className="text-lg font-semibold text-tiffany_blue mb-2 font-display">Background</h3>
      <p className="text-sm text-vanilla/80 italic mb-2">
        {shortBio || 'Short bio placeholder...'}
      </p>
      <p className="text-xs text-tiffany_blue/70">
        <span className="font-semibold">Faction:</span> {faction || 'Unknown Faction'} <br />
        <span className="font-semibold">Origin:</span> {origin || 'Unknown Origin'}
      </p>
      <p className="text-sm text-vanilla/80 mt-3">
        {longBio || 'Longer background description placeholder text. This area can contain more details about the character\'s history and motivations.'}
      </p>
    </div>
  );
};

export default BackgroundSection; 