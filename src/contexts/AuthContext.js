import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"

const AuthContext = React.createContext()
 
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)


    const value = {
        currentUser,
        login, 
        logout,
        signup
    }

    function logout() {
        return auth.signOut()
    }

    function signup(email, password){
        return auth.createUserWithEmailAndPassword(email, password)
    }


    function login(email, password){
        return auth.signInWithEmailAndPassword(email, password)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])
   

    
    return (
        <AuthContext.Provider value={value}>
             {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}