// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  user_id: number;
  user_username: string;
  user_email: string;
  user_password: string;
  user_salt: string;
  user_createdAt: Date;
}
interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Set the user state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // const checkSession = async () => {
  //   const response = await fetch(`${import.meta.env.VITE_CANISTER_URL}/app/profile`, {
  //     method: 'GET',
  //     credentials: 'include', // Important! This sends the session cookie with the request
  //   });

  //   const data = await response.json();
  //   if (data.isAuthenticated) {
  //     const data = await response.json();
  //     console.log(data.user);
  //     setUser(data.user);
  //     setIsAuthenticated(true);
  //   } else {
  //     setUser(null);
  //     setIsAuthenticated(false);
  //   }
  // };

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
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const userFromDatabase = await doubleCheckUserInDatabase(JSON.parse(storedUser).user_id); // Await the async function
        
        console.log(userFromDatabase);
  
        if (userFromDatabase === null) {
          // If the user exists in the database, log out
          logout();
        } else {
          // If the user does not exist, set the user and authentication state
          setUser(userFromDatabase);
          setIsAuthenticated(true);
        }
      } else {
        logout(); // Logout if no user is stored locally
      }
    };
  
    checkUser(); // Call the async function inside useEffect
  }, []);

  const login = async (email: string, password: string) => {
    const url = `${import.meta.env.VITE_CANISTER_URL}/app/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email: email, user_password: password }),
      // credentials: 'include'
    });
    const data = await response.json();

    if (data.status === 200) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user); // Assuming the user data comes back in the response
      setIsAuthenticated(true);
      console.log("Login successful!");
    } else {
      throw new Error(data.message || "Login failed");
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
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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