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
      
      width: props.research ? '11vw' : '10vw', 
      height: props.research ? '4rem' : '4rem', 
      
    },
    textOverlay: {
      position: 'absolute',
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -55%)', 
color: 'white', 

fontSize: props.research ? '12px' : '17px', 
 

},
};

const [isPressed, setIsPressed] = useState(false); 

  const handleClick = () => {
    setIsPressed(true); 
    setTimeout(() => {
      setIsPressed(false); 
    }, 200); 

    
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


