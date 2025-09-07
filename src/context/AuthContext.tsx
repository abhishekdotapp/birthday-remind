'use client'
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {account}  from "@/lib/appwrite";
import {ID, Models} from "appwrite";

interface AuthContextProps {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setloading] =  useState(true);

    useEffect(()=> {
        checkUserStatus();
    }, []);

    const checkUserStatus = async() => {
        try{
            const currentUser = await account.get();
            setUser(currentUser);
        } catch(e){
            setUser(null);
        } finally {
            setloading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try{
            // Check if there's already an active session and delete it
            try {
                await account.get();
                // If we get here, there's an active session, so delete it
                await account.deleteSession('current');
            } catch {
                // No active session, which is fine
            }
            
            // Create new session
            await account.createEmailPasswordSession(email, password);
            const currentUser = await account.get();
            setUser(currentUser);
        } catch(e){
            console.log(e);
            throw e;
        }
    };

    const signUp = async (email:string , password: string, name: string) => {
        try{
            await account.create(
                ID.unique(),
                email,
                password,
                name
            );
            await signIn(email, password);
        } catch(e){
            console.log(e);
            throw e;
        }
    };

    const signOut = async () => {
        try{
            await account.deleteSession('current');
            setUser(null); // Update user state to trigger redirection
        } catch(e){
            console.log(e);
            throw e;
        }
    };


    const value ={
        user,
        loading,
        signIn,
        signUp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
