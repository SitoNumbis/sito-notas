/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useReducer, useContext } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import { saveUser } from "../utils/auth";

const UserContext = createContext();

const userReducer = (userState, action) => {
  const { type } = action;
  switch (type) {
    case "set-notes": {
      const { notes } = action;
      saveUser({ ...userState, notes });
      return { ...userState, notes };
    }
    case "add-note": {
      const { newNote } = action;
      saveUser({ ...userState, notes: [...userState.notes, newNote] });
      return { ...userState, notes: [...userState.notes, newNote] };
    }
    case "set-types": {
      const { types } = action;
      return { ...userState, types };
    }
    case "logged-out":
      return {};
    case "logged-in": {
      const { user, photo, cached, account } = action;
      return { user, photo, cached, account };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const UserProvider = ({ children }) => {
  const [userState, setUserState] = useReducer(userReducer, {});

  const value = { userState, setUserState };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// hooks
const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("userContext must be used within a Provider");
  return context;
};

export { UserProvider, useUser };
