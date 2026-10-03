import { useState } from 'react';
import { useCarbonFootprint } from 'react-carbon-footprint';

const CarbonFootprintDisplay = () => {
  const [gCO2, bytesTransferred] = useCarbonFootprint();
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Show carbon footprint"
        style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '50%',
          width: 36,
          height: 36,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: '16px',
        }}
      >
        🌱
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        background: 'rgba(255, 255, 255, 0.85)',
        padding: '10px 14px',
        borderRadius: '8px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <button
        onClick={() => setOpen(false)}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: 2,
          right: 6,
          background: 'none',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          color: '#666',
        }}
      >
        ×
      </button>
      <h3 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#16110d', fontWeight: 'bold' }}>
        Network Carbon Footprint
      </h3>
      <p style={{ margin: '2px 0', fontSize: '13px', color: '#2c261f' }}>
        Bytes Transferred: {bytesTransferred ?? 0} bytes
      </p>
      <p style={{ margin: '2px 0', fontSize: '13px', color: '#2c261f' }}>
        CO2 Emissions: {typeof gCO2 === 'number' ? gCO2.toFixed(2) : (Number(gCO2) || 0).toFixed(2)} grams CO2eq
      </p>
      <p style={{ fontSize: '0.8em', color: '#666', margin: '4px 0 0 0' }}>
        (Estimates based on network data transfer during this session)
      </p>
    </div>
  );
};

export default CarbonFootprintDisplay;