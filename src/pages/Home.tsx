import React from 'react';

const a11yStyles = {
  container: {
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    backgroundColor: 'white',
    minHeight: '100vh',
  },
  header: {
    color: '#3C5A51',
    fontSize: '3rem',
    fontWeight: '900',
    textAlign: 'center' as const,
  },
  card: {
    backgroundColor: '#EEF2F4',
    padding: '2rem',
    borderRadius: '20px',
    marginTop: '2rem',
    width: '100%',
    maxWidth: '500px'
  }
};

const Home = () => {
  return (
    <div style={a11yStyles.container}>
      <h1 style={a11yStyles.header}>MSConnect: Root Edition</h1>
      <div style={a11yStyles.card}>
        <h2 style={{fontSize: '1.8rem'}}>Welcome</h2>
        <p style={{fontSize: '1.2rem'}}>Your data is now being served from the Root directory. This fixes the build errors.</p>
      </div>
    </div>
  );
};

export default Home;
