import React, { 
  useState, useEffect, createContext, useContext 
} from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const Context = createContext();

function useAuthChanged(auth, func) {
  useEffect(() => {
    const unsub = auth().onAuthStateChanged(async function(user) {
      func(user);
    });
    return unsub;
  }, []);
}

const MinimalAuth = ({uiConfig, auth, children}) => {
  const [loginState, setLoginState] = useState('loading');
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = auth().onAuthStateChanged(async function(user) {
      if (user) {
        setUser(user);
        setLoginState('logged_in');
      } else {
        setLoginState('logged_out');
        setUser(undefined);
      };
    });
    return unsub;
  }, []);

  return <Context.Provider value={{uiConfig, auth, user, loginState}}>
    {children}
  </Context.Provider>
}

const useFirebaseAuthState = () => {
  return useContext(Context);
}

const LoginForm = () => {
  const {uiConfig, auth} = useFirebaseAuthState();

  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth()} />
};

export { 
  useAuthChanged, MinimalAuth, LoginForm, useFirebaseAuthState 
};
