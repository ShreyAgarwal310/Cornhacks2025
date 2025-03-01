import './index.css'; 

export default function DesignedButton(props) {
    return(
        <div>
            <button onClick={props.clickFunction} style={styles.button}>
                <div style={styles.imageContainer}>
                    <img src={`/uiElements/button${props.type}.png`} alt="img not found" style={styles.image} />
                <div style={styles.textOverlay}>{props.text}</div>
                </div>
            </button>
        </div>
    );
}

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
      width: '18vw',
      height: '3.125rem',
      // height: 'auto',
    },
    textOverlay: {
      position: 'absolute',
      top: '50%', // Center vertically
      left: '50%', // Center horizontally
      transform: 'translate(-50%, -50%)', // Adjust for exact centering
color: 'white', // Text color
fontSize: '16px', // Text size
fontWeight: 'bold', // Text weight
textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Optional: Add a shadow for better readability
},
};


