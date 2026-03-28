interface AuthState {
    isSignedIn: boolean;
    userName: string | null;
    userId: string | null;
}

type AuthContext = {
    isSignedIn: boolean;
    userName: string | null;
    userId: string | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}


