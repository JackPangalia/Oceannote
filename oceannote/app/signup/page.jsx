"use client";

import IconGoogle from "../components/icons/IconGoogle";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "../firebase";
import { useRouter } from "next/navigation";

const Signup = () => {
  // Init firebase
  initFirebase();

  // define the provider as google as well as defining the auth hook
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  // router 
  const router = useRouter();

  // FUNCTION TO SIGN IN USING GOOGLE POPUP
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/notes')
    } catch (error) {
      console.log("There was an error: ", error);
    }
  };

  //* ACCOUNT FOR PROFILE LOADING *//
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-4xl">
        <h1>Loading</h1>
      </div>
    );
  }

  //* ACCOUNT FOR USERS LOGGED IN ALREADY *//
  if (user) {
    return (
      <div className="h-screen flex justify-center items-center">
        <button
          onClick={() => auth.signOut()}
          className="border-gray-500 border-[1px] px-4 py-2 rounded-lg dark:hover:bg-darkMode hover:bg-zinc-100 transition-all duration-200"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <>
      <main className="h-screen flex justify-center items-center flex-col gap-10">
        <h1 className="text-4xl">Sign up</h1>
        <button
          onClick={signIn}
          className="flex items-center gap-2 px-16 py-3 rounded-lg border-gray-500 border-[1px] shadow-lg dark:hover:bg-darkMode hover:bg-zinc-100 transition-all duration-200"
        >
          <IconGoogle className="size-[0.96rem]" />
          Sign in with Google
        </button>
      </main>
    </>
  );
};

export default Signup;
