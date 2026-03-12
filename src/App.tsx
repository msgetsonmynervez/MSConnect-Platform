import { Switch, Route, Link } from "wouter";
import { EnergyProvider } from "./context/EnergyContext"; // Saved from deletion!
import Home from "./pages/Home";
import Progress from "./pages/Progress";

const Nav = () => (
  <nav style={{ 
    padding: '1.5rem', 
    backgroundColor: '#3C5A51', 
    display: 'flex', 
    gap: '2rem',
    justifyContent: 'center'
  }}>
    <Link href="/"><a style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none' }}>Home</a></Link>
    <Link href="/progress"><a style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'none' }}>Trends</a></Link>
  </nav>
);

function App() {
  return (
    <EnergyProvider>
      <Nav />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/progress" component={Progress} />
          <Route>
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <h1>404</h1>
              <p>Page not found.</p>
            </div>
          </Route>
        </Switch>
      </div>
    </EnergyProvider>
  );
}

export default App;
