
import  { createContext, useState, useEffect, } from "react";
import type { ReactNode } from 'react';
import type { User } from "../types/user";
import api from "../utils/axios";

    

// Context type
 export interface AuthContextType {

    user: User | null;
    loading: boolean;
    register: (name: string, email: string, password: string
    ) => Promise<{ message: string; email: string }>;
    login: (email: string, password: string) => Promise<User>;
    verifyOtp: (email: string, otp: string) => Promise<User>;
    logout: () => void;
}

//  Create Context
  export const AuthContext =
    createContext<AuthContextType | null>(null);


//  Props type for Provider
interface AuthProviderProps {
    children: ReactNode;
}


//  Provider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {

            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);
            
        }
        setLoading(false);
    }, []);


    // register user 

    const register = async (
        name: string,
        email: string,
        password: string
    ): Promise<{ message: string; email: string }> => {

        try {

            const response = await api.post(
                "/auth/register",
                { name, email, password }
            );
            const data: { message: string; email: string } =
                response.data;

            return data;
        } catch (error) {

            console.log("Registration failed", error);
            throw error;
        }
    };

    // Login function
    const login = async (
        email: string,
        password: string
    ): Promise<User> => {

        try {
            const response = await api.post("/auth/login", { email, password, });
            const data: User = response.data;
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);

            return data;
        } catch (error) {
            console.log("Login failed", error);
            throw error;
        }
    };

    // Verify OTP
    const verifyOtp = async (
        email: string,
        otp: string
    ): Promise<User> => {
    

        try {
            const response = await api.post("/auth/verify-otp", { email, otp, });
            const data: User = response.data;
            setUser(data);

            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);

            return data;

        } catch (error) {

            console.log("OTP verification failed", error);
            throw error;
        }
    };

    // Logout
    const logout = () => {

        setUser(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                verifyOtp,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};

