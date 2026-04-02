import React, { useState } from 'react';

const Counter = () => {
  // Step 1: Initialize state with 0
  const [count, setCount] = useState(0);

  // Step 2: Define the updater functions
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  // Step 3: Define basic styling
  const styles = {
    wrapper: { textAlign: 'center', marginTop: '50px' },
    count: { fontSize: '3rem', margin: '20px' },
    button: { padding: '10px 20px', fontSize: '1rem', cursor: 'pointer', margin: '5px' }
  };

  return (
    <div style={styles.wrapper}>
      <h1>Simple Counter</h1>
      {/* Step 4: Display the dynamic state value */}
      <div style={styles.count}>{count}</div>
      
      {/* Step 5: Attach event handlers to buttons */}
      <button style={styles.button} onClick={decrement}>Decrease</button>
      <button style={styles.button} onClick={increment}>Increase</button>
    </div>
  );
};

export default Counter;