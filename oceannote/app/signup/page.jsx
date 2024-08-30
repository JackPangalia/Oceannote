"use client";

import IconGoogle from "../components/icons/IconGoogle";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "../firebase";
import { useRouter } from "next/navigation";
import { db } from "../firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

const Signup = () => {
  // Init firebase
  initFirebase();

  // Define the provider as Google as well as defining the auth hook
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  // Router
  const router = useRouter();

  // FUNCTION TO CREATE DEFAULT "notes" FOLDER
  const createDefaultFolder = async (userId) => {
    const folderRef = doc(db, `users/${userId}/folders`, "notes");

    try {
      await setDoc(folderRef, {
        name: "notes",
        color: "#f4f4f5", // Default color or any other properties you want to set
        createdAt: serverTimestamp(),
        isDeletable: false,
      });
      console.log("Default 'notes' folder created.");
    } catch (error) {
      console.error("Error creating default folder: ", error);
    }
  };

  // FUNCTION TO SIGN IN USING GOOGLE POPUP
  const signIn = async () => {
    try {
      // Sign in the user
      const result = await signInWithPopup(auth, provider);

      // Get the user ID
      const user = result.user;

      // Create the default "notes" folder
      await createDefaultFolder(user.uid);

      // Redirect the user to the notes page
      router.push("/notes");
    
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
