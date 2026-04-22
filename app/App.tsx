import { RouterProvider } from 'react-router';
import { router } from '@/router';
import { ThemeProvider } from '@/contexts/ThemeContext'; // Importación según tu estructura

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;