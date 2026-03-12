import { Switch, Route } from "wouter";
// We are intentionally ONLY importing the clean, local-storage pages.
// Cloud-dependent pages are disconnected until they are rewritten for Zero-Knowledge.
import Home from "./pages/Home";
import Progress from "./pages/Progress";

function App() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/progress" component={Progress} />
        <Route>
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <h1 style={{ color: '#3C5A51', fontSize: '2rem' }}>Page Under Construction</h1>
            <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
              This feature is being updated to support secure, on-device Zero-Knowledge storage.
            </p>
            <a href="/" style={{ display: 'inline-block', marginTop: '2rem', padding: '1rem 2rem', backgroundColor: '#3C5A51', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              Return Home
            </a>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
