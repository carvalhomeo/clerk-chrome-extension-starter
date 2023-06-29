import "./App.css";

import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  useClerk,
  useUser,
  ClerkProvider,
} from "@clerk/chrome-extension";
import {
  useNavigate,
  Routes,
  Route,
  MemoryRouter
} from "react-router-dom";
import Page from "./Page";

function HelloUser() {
  const { isSignedIn, user } = useUser();
  const clerk = useClerk();

  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      <p>Hi, {user.primaryEmailAddress?.emailAddress}!</p>
      <p>
        <button onClick={() => clerk.signOut()}>Sign out</button>
      </p>
    </>
  );
}

const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || "";


function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Page />
    </ClerkProvider>
  );
}

export default App;
