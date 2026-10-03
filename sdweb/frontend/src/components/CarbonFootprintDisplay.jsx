import React from 'react';
import { useCarbonFootprint } from 'react-carbon-footprint';

const CarbonFootprintDisplay = () => {
  const [gCO2, bytesTransferred] = useCarbonFootprint();

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
        fontFamily: 'Arial, sans-serif'
      }}
    >
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
