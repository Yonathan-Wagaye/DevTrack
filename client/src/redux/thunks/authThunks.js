import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginStart, loginFailure, loginSuccess, registerStart, registerSuccess, registerFailure } from "../slices/authSlice";
import { supabase } from "../../config/supabase";

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { dispatch, rejectWithValue }) => {    
        try {
            dispatch(loginStart());

            // Use Supabase authentication
            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password
            });

            if (error) {
                throw new Error(error.message);
            }

            // Extract user data from Supabase response
            const user = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name || 'User',
                createdAt: data.user.created_at
            };

            // Get the access token from Supabase
            const token = data.session?.access_token;

            console.log('🔑 authThunks: Login token:', token ? 'Token received' : 'No token');

            dispatch(loginSuccess(user));
            
            // Return both user and token for session management
            return { user, token };
        } catch (error) {
            dispatch(loginFailure(error.message));
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { dispatch, rejectWithValue }) => {    
        try {
            dispatch(registerStart());

            // Use Supabase authentication
            const { data, error } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        name: userData.name
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            // Extract user data from Supabase response
            const user = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name || 'User',
                createdAt: data.user.created_at
            };

            dispatch(registerSuccess(user));
            return user;
        } catch (error) {
            dispatch(registerFailure(error.message));
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { dispatch, rejectWithValue }) => {    
        try {
            // Use Supabase authentication
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw new Error(error.message);
            }

            // Return success (logout will be handled by the slice)
            return null;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);