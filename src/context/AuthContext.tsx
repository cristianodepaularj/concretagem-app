import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string) => Promise<void>;
    loginWithPassword: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchUserProfile(session.user.id, session.user.email!);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchUserProfile(session.user.id, session.user.email!);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId: string, email: string) => {
        try {
            // Try to fetch user profile from 'users' table
            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) {
                setUser(data as User);
            } else {
                // If user doesn't exist in public.users, create a default profile
                const isFirstUser = email === 'cristianospaula1972@gmail.com';
                const newUser = {
                    id: userId,
                    email: email,
                    name: email.split('@')[0],
                    role: isFirstUser ? 'admin' : 'consultant',
                };

                // Insert into Supabase
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([newUser]);

                if (insertError) {
                    console.error('Error creating user profile:', insertError);
                } else {
                    setUser(newUser as User);
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // Fallback: Allow access even if profile fetch fails
            const fallbackUser: User = {
                id: userId,
                email: email,
                name: email.split('@')[0],
                role: 'consultant',
            };
            setUser(fallbackUser);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin
            }
        });
        if (error) throw error;
        alert('Check your email for the login link!');
    };

    const loginWithPassword = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        alert('Cadastro realizado! Verifique seu email para confirmar.');
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, loginWithPassword, signUp, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
