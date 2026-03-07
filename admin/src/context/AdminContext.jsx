import { createContext } from "react";

const AdminContext = createContext({
  token: null,
  admin: null,
  login: () => {},
  logout: () => {},
  authHeaders: {},
  isAuthenticated: false,
});

export default AdminContext;
