import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginStart, loginFailure, loginSuccess, registerStart, registerSuccess, registerFailure } from "../slices/authSlice";
import { API_BASE_URL } from "../../config/api";
import { getStoredToken } from "../../config/session";

const readErrorMessage = async (response, fallback) => {
    try {
        const data = await response.json()
        return data.message || fallback
    } catch {
        return fallback
    }
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            dispatch(loginStart());

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            })

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, 'Login failed'))
            }

            const data = await response.json()
            const { user, token } = data

            dispatch(loginSuccess(user));
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

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })

            if (!response.ok) {
                throw new Error(await readErrorMessage(response, 'Registration failed'))
            }

            const data = await response.json()
            const { user, token } = data

            dispatch(registerSuccess(user));
            dispatch(loginSuccess(user));
            return { user, token };
        } catch (error) {
            dispatch(registerFailure(error.message));
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async () => {
        const token = getStoredToken()

        if (token) {
            try {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            } catch {
                // Local logout should still succeed if the API is unreachable
            }
        }

        return null;
    }
);
