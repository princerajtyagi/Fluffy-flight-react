// src/components/CloudBackground.jsx
import React from 'react';

// This component is purely for visuals.
// We can use it on any page that needs the sky background.
function CloudBackground() {
  return (
    <div className="clouds" aria-hidden="true">
      <div className="cloud c1"></div>
      <div className="cloud c2"></div>
      <div className="cloud c3"></div>
      <div className="cloud c4"></div>
    </div>
  );
}

export default CloudBackground;