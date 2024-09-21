import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

export const checkUserRole = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.role;
    } else {
        return null; // If the user document doesn't exist, deny access
    }
};

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    setUser(firebaseUser);
                    const role = await checkUserRole(firebaseUser);
                    setUserRole(role);
                } else {
                    setUser(null);
                    setUserRole(null);
                }
            } catch (err) {
                setError(err);
                console.error("Auth error:", err);
            } finally {
                setLoading(false);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return { user, loading, error, userRole };
};