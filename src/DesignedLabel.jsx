import React, { useState } from 'react';
import './index.css';

export default function DesignedLabel(props) {
  

  const styles = {
    button: {
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
    },
    imageContainer: {
      position: 'relative',
      display: 'inline-block',
    },
    image: {
      width: '12vw',
      height: '4rem',
    },
    textOverlay: {
      position: 'absolute',
      top: '50%',
      left: '10%',
      transform: 'translate(-0%, -53%)',
      color: 'white',
      fontSize: '18px',
      fontWeight: 'bold',
    //   textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    },
  };

  return (
    <div>
      <button style={styles.button}>
        <div style={styles.imageContainer}>
          <img
            src={`/uiElements/label${props.type}.png`}
            alt="img not found"
            style={styles.image}
          />
          <div style={styles.textOverlay}>{props.text}</div>
        </div>
      </button>
    </div>
  );
}