import './App.css';
import { ThemeProvider } from '@/components/theme/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <p />
    </ThemeProvider>
  );
}

export default App;
