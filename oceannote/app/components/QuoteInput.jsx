"use client";
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

const QuoteInput = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user?.uid;

  const [quote, setQuote] = useState("");

  // Function to save the quote in Firebase
  const saveQuote = async (newQuote) => {
    if (!userId) return;

    try {
      const userRef = doc(db, `users/${userId}/profile/info`);
      await setDoc(userRef, { quote: newQuote }, { merge: true });
    } catch (error) {
      console.error("Error saving quote: ", error);
    }
  };

  // Function to load the quote from Firebase
  const loadQuote = async () => {
    if (!userId) return;

    try {
      const userRef = doc(db, `users/${userId}/profile/info`);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setQuote(data.quote || "");
      }
    } catch (error) {
      console.error("Error loading quote: ", error);
    }
  };

  // Load the quote when the component mounts
  useEffect(() => {
    loadQuote();
  }, [userId]);

  // Handle input change and save the quote
  const handleInputChange = (event) => {
    const newQuote = event.target.value;
    setQuote(newQuote);
    saveQuote(newQuote);
  };

  return (
    <input
      type="text"
      value={quote}
      onChange={handleInputChange}
      placeholder='"quote"'
      className="outline-none w-[20rem] text-gray-500 bg-transparent"
    />
  );
};

export default QuoteInput;
