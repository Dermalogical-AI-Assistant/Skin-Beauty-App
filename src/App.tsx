import './App.css'
import Routes from "./routes";
import AuthProvider from "./providers/AuthProvider.tsx";

/**
 * Main application component
 * Wraps the entire application with the AuthProvider to enable authentication
 * and renders the Routes component to handle application routing
 * @returns {JSX.Element} The rendered application with authentication context and routing
 */
function App() {
    return (
        <>
            <AuthProvider>
                <Routes/>
            </AuthProvider>
        </>
    )
}

export default App