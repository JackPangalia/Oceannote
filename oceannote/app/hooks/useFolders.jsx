'use client'

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import path as needed
import { getAuth } from "firebase/auth";

const useFolders = () => {
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  

  return { folders, loading };
};

export default useFolders