import React from 'react';
import StudentCard from './StudentCard';

function App() {
  const appStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif'
  };

  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Student Directory</h1>
      
      <div style={appStyle}>
        {/* Reusing the StudentCard component with different props */}
        <StudentCard 
          name="Alice Johnson" 
          dept="Computer Science" 
          marks={92} 
        />
        
        <StudentCard 
          name="Bob Smith" 
          dept="Mechanical Engineering" 
          marks={85} 
        />
        
        <StudentCard 
          name="Charlie Davis" 
          dept="Electrical Engineering" 
          marks={78} 
        />

        <StudentCard 
          name="Diana Prince" 
          dept="Physics" 
          marks={95} 
        />
      </div>
    </div>
  );
}

export default App;