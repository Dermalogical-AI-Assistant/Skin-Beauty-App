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
    const contextClass = {
      success: "bg-orange-50 text-orange-500",
      error: "bg-orange-50 text-red-700",
      info: "bg-orange-50 text-stone-500",
      warning: "bg-orange-50 text-orange-500",
      default: "bg-orange-50 text-orange-500",
      dark: "bg-orange-50 text-orange-500",
    };
    return (
        <MantineProvider>
            <QueryClientProvider client={queryClient}>
                <Routes />
                <ToastContainer
                  className={`min-w-`}
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    toastClassName={(context) =>
                      contextClass[context?.type || "default"] +
                      " relative flex px-5 py-5 my-2 drop-shadow-lg min-w-64 rounded-md justify-start overflow-hidden cursor-pointer"
                    }
                    pauseOnFocusLoss
                    theme="light"
                    draggable
                    pauseOnHover
                />
            </QueryClientProvider>
        </MantineProvider>
    );
}

export default App;
