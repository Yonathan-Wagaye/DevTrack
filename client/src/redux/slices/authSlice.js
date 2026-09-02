import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    isSessionLoading: true,
    error: null,
    showEmailVerification: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.showEmailVerification = false;  // Hide message when user tries to login
        },
        loginSuccess: (state, action) => {
            console.log('🔧 authSlice: loginSuccess called with:', action.payload);
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isLoading = false;
            state.error = null;
            console.log('🔧 authSlice: State after loginSuccess:', { isAuthenticated: state.isAuthenticated, user: state.user });
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            state.isLoading = false;
        },
        setCredentials: (state, action) => {
            console.log('🔧 authSlice: setCredentials called with:', action.payload);
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.isLoading = false;
            state.error = null;
            console.log('🔧 authSlice: State updated to:', { isAuthenticated: state.isAuthenticated, user: state.user });
        },
        clearCredentials: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            state.isLoading = false;
        },
        setSessionLoading: (state, action) => {
            state.isSessionLoading = action.payload;
        },
        // Registration actions
        registerStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.showEmailVerification = true;  // Show email verification message
            // Note: We don't set isAuthenticated to true here
            // User needs to login after registration
        },
        registerFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.showEmailVerification = false;  // Hide message on failure
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase('auth/logoutUser/fulfilled', (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                state.isLoading = false;
            })
            .addCase('auth/logoutUser/rejected', (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, setCredentials, clearCredentials, setSessionLoading, registerStart, registerSuccess, registerFailure } = authSlice.actions;
export default authSlice.reducer;