import { createContext, useContext, useState } from "react";

const SESSION_KEY = "student-support-session";
const USERS_KEY = "student-support-demo-users";

const demoUsers = [
  {
    id: "demo-amit-student",
    name: "Amit Student",
    email: "amit.student@example.com",
    password: "student123",
    role: "student",
    department: "Computer Science",
  },
  {
    id: "demo-rahul-support",
    name: "Rahul Support",
    email: "rahul.staff@example.com",
    password: "staff123",
    role: "staff",
    department: "Student Support",
  },
  {
    id: "demo-admin-user",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    department: "Administration",
  },
];

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const findUser = (email, password) =>
  [...demoUsers, ...readUsers()].find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password,
  );

const publicUser = ({ password, ...user }) => user;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const matchedUser = findUser(email, password);

    if (!matchedUser) {
      throw new Error("Invalid email or password.");
    }

    const sessionUser = publicUser(matchedUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  const signup = ({ name, email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const allUsers = [...demoUsers, ...readUsers()];

    if (
      allUsers.some((existingUser) => existingUser.email === normalizedEmail)
    ) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: `demo-signup-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      department: role === "staff" ? "Student Support" : "",
    };

    localStorage.setItem(USERS_KEY, JSON.stringify([...readUsers(), newUser]));
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isAuthenticated: Boolean(user) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
