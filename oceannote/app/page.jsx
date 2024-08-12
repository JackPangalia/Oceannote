"use client";

import Link from "next/link";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "./firebase";
import { useRouter } from "next/navigation";

const Home = () => {
  // Init firebase
  initFirebase();

  // define the auth state
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  // router
  const router = useRouter();

  //* ACCOUNT FOR PROFILE LOADING *//
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-4xl">
        <h1>Loading</h1>
      </div>
    );
  }

  if (user) {
    router.push("/notes");
  }

  return (
    <>
      <main className="h-[90vh] px-[2rem] max-w-[1500px] mx-auto flex justify-center items-center flex-col gap-10 ">
        <h1 className="lg:text-5xl md:text-4xl text-3xl lg:w-1/3 md:w-3/4 mx-[2rem] text-center">
          Note Taking Simply Designed For Your Output.
        </h1>

        <p className="lg:w-1/2 md:w-3/4 px-[2rem] text-center text-zinc-400 text-sm mx-auto ">
          Your personalized gateway to simple digital organization –
          seamlessly simplicity. Our carefully crafted digital notes
          effortlessly meet all your needs, providing the ease of a traditional
          paper notes with the sophistication of modern document editors.
        </p>

        <Link
          href="/signup"
          className="border-zinc-500 shadow-lg border-[1px] px-4 py-2 rounded-lg dark:hover:bg-darkMode hover:bg-zinc-100 transition-all duration-200"
        >
          Sign up now
        </Link>
      </main>
    </>
  );
};

export default Home;
