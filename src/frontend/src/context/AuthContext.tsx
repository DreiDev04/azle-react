// AuthContext.tsx
import { TUser } from "@/types/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: TUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TUser | null>(null); // Set the user state
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const doubleCheckUserInDatabase = async (user_id: number) => {
    const response = await fetch(`${import.meta.env.VITE_CANISTER_URL}/app/get_user/${user_id}`, {
      method: 'GET',
    });

    if (response.ok) {
      const user = (await response.json()).data;
      return user ? user : null;
    } else {
      return null;
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem("user");
    
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Parsed stored user:", parsedUser);
    
          if (!parsedUser?.user_id) {
            console.error("No user_id found in storedUser:", parsedUser);
            logout(); // Log out if the user_id is missing
            return;
          }
    
          const userFromDatabase = await doubleCheckUserInDatabase(parsedUser.user_id);
          console.log("User fetched from database:", userFromDatabase);
    
          if (!userFromDatabase || !userFromDatabase.user_id) {
            console.error("User not found or user_id missing, logging out.");
            logout();
          } else {
            console.log("User ID from database:", userFromDatabase.user_id);
            setUser(userFromDatabase);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Error parsing or fetching user:", error);
          logout();
        }
      } else {
        logout();
      }
    };
  
    checkUser();
  }, []);
  

  const login = async (email: string, password: string) => {
    // Log the response to ensure `user_id` is being received
    const url = `${import.meta.env.VITE_CANISTER_URL}/app/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email: email, user_password: password }),
    });
    const data = await response.json();
    console.log("Login response:", data);
  
    if (data.status === 200) {
      const filteredUser = {
        user_id: data.user.user_id, // Ensure user_id is correctly set
        user_name: data.user.user_username,
        user_createdAt: data.user.user_createdAt,
      };
      localStorage.setItem("user", JSON.stringify(filteredUser));
      setUser(data.user);
      setIsAuthenticated(true);
      console.log("Login successful!");
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    const url = `${import.meta.env.VITE_CANISTER_URL}/app/create_user`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_username: username,
          user_email: email,
          user_password: password,
        }),
      });
  
      const data = await response.json();
      console.log("Signup response:", data);
      
      if (response.status === 201) {
        const newUser = {
          user_id: data.user.user_id, // Ensure user_id is correctly set
          user_name: data.user.user_username,
          user_createdAt: data.user.user_createdAt,
        };
        console.log("New user:", newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(data.user);
        setIsAuthenticated(true);
        console.log("Signup successful!");
      } else {
        throw new Error(data.message || "Signup failed");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Error: ${error.message}`);
      } else {
        console.log("An unknown error occurred");
      }
    }
  };
  

  const logout = async () => {
    // await fetch(`${import.meta.env.VITE_CANISTER_URL}/app/logout`, {
    //   method: 'POST',
    //   credentials: 'include', // Send session cookie with the request to destroy the session
    // });
    localStorage.removeItem('user');
    //console.log("Logout successful!");

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, signup}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};