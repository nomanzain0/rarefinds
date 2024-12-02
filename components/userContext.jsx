import { View, Text } from "react-native";
import React from "react";
import { createContext } from "react";
import { useState } from "react";
export const MyUserContext = createContext();
export const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fav,setFav]=useState([])
  return (
    <MyUserContext.Provider value={{ user, setUser,fav,setFav }}>
      {children}
    </MyUserContext.Provider>
  );
};
