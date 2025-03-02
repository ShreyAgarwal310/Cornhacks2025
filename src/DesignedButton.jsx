import './index.css'; 
import React, { useState } from 'react';

export default function DesignedButton(props) {
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
      // width: '100px', // Adjust the size of the image
      // width: '12vw',
      width: props.research ? '12vw' : '12vw', 
      height: props.research ? '4rem' : '4rem', 
      // height: '4rem',
      // height: 'auto',
    },
    textOverlay: {
      position: 'absolute',
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -55%)', 
color: 'white', 
// fontSize: '16px', // Text size
fontSize: props.research ? '12px' : '17px', 
 
// textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', 
},
};

const [isPressed, setIsPressed] = useState(false); // State to track if the button is pressed

  const handleClick = () => {
    setIsPressed(true); // Set the button to "pressed" state
    setTimeout(() => {
      setIsPressed(false); // Revert the button to "unpressed" state after a delay
    }, 200); // Adjust the delay (in milliseconds) as needed

    // Call the provided click function
    if (props.clickFunction) {
      props.clickFunction();
    }
  };
  
    return(
        <div>
            <button onClick={handleClick} style={styles.button}>
                <div style={styles.imageContainer}>
                    <img src={`/uiElements/button${props.type}${isPressed ? 'P' : ''}.png`} alt="img not found" style={styles.image} />
                <div style={styles.textOverlay}>{props.text}</div>
                </div>
            </button>
        </div>
    );

    
}


