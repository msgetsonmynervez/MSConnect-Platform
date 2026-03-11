import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import { useSymptomData } from "./hooks/useSymptomData";

function App() {
  // Initialize the secure local data bridge immediately
  const { symptoms, addSymptom } = useSymptomData();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/log">
        {/* The Symptom Logger will live here once restored */}
        <div style={{ padding: '2rem', fontSize: '2rem' }}>Symptom Logger Loaded</div>
      </Route>
      <Route>444: Page Not Found</Route>
    </Switch>
  );
}

export default App;
