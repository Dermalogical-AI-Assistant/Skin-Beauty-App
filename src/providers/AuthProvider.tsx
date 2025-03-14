import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

/**
 * Interface defining the type structure for AuthContext
 * @interface AuthContextType
 * @property {string | null} token - Current authentication token or null if not logged in
 * @property {function} setToken - Function to update the authentication token
 */
interface AuthContextType {
    token: string | null;
    setToken: (newToken: string | null) => void;
}

/**
 * Context for managing authentication state throughout the application
 * @type {React.Context<AuthContextType | null>}
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Props for the AuthProvider component
 * @interface AuthProviderProps
 * @property {ReactNode} children - Child components that will have access to the AuthContext
 */
interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Provider that manages authentication state and provides it to the entire application
 * @component
 * @param {AuthProviderProps} props - Component props
 * @returns {JSX.Element} AuthContext Provider with values and children
 */
const AuthProvider = ({ children }: AuthProviderProps) => {
    /**
     * State to store the authentication token, initialized from localStorage
     */
    const [token, setToken_] = useState<string | null>(localStorage.getItem("token"));

    /**
     * Function to update the authentication token
     * @param {string | null} newToken - New token to store or null to log out
     */
    const setToken = (newToken: string | null) => {
        setToken_(newToken);
    };

    /**
     * Effect that handles token changes:
     * - If token exists: add to axios headers and save to localStorage
     * - If no token: remove from axios headers and localStorage
     */
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem("token", token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    /**
     * Memoized context value to optimize performance
     */
    const contextValue = useMemo(
        () => ({
            token,
            setToken,
        }),
        [token]
    );

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

/**
 * Custom hook to access the AuthContext from any child component
 * @returns {AuthContextType} Object containing token and setToken function
 * @throws {Error} If used outside of an AuthProvider
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthProvider;