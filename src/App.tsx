import './App.css';
import Routes from "./routes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from "@mantine/core";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Main application component
 * Wraps the entire application with the AuthProvider to enable authentication
 * and renders the Routes component to handle application routing
 * @returns {JSX.Element} The rendered application with authentication context and routing
 */
function App() {
    const queryClient = new QueryClient();

    return (
        <MantineProvider>
            <QueryClientProvider client={queryClient}>
                <Routes />
                <ToastContainer 
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </QueryClientProvider>
        </MantineProvider>
    );
}

export default App;
