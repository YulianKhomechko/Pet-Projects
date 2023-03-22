import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { loginThunk, logoutThunk } from '../thunks/authThunk';
import { isAuthFulfilled, isAuthRejected, isThunkRejected } from './helpers/reducerMatcherFunctions';
import { ResponseError } from '../models/ResponseError';
import { userRoles } from '../constants/userRoles';

interface authState {
    userId: number | null;
    userRole: userRoles | null;
    userFirstName: string | null;
    userLastName: string | null;
    error: ResponseError | null;
}

const initialState: authState = {
    userId: null,
    userRole: null,
    userFirstName: null,
    userLastName: null,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // login
        builder.addCase(loginThunk.fulfilled, (state, { payload }) => {
            state.userId = payload.userId;
            state.userRole = payload.userRole;
            state.userFirstName = payload.userFirstName;
            state.userLastName = payload.userLastName;
        });

        // logout
        builder.addCase(logoutThunk.fulfilled, (state) => {
            state.userId = null;
            state.userRole = null;
            state.userFirstName = null;
            state.userLastName = null;
        });

        builder
            .addMatcher(isThunkRejected, (state, action) => {
                if (action.error.name === 'unauthorizedUser') {
                    state.userId = null;
                    state.userRole = null;
                    state.userFirstName = null;
                    state.userLastName = null;
                }
            })
            .addMatcher(isAuthRejected, (state, action) => {
                state.error = action.error.message;
            })
            .addMatcher(isAuthFulfilled, (state) => {
                state.error = null;
            });
    }
});

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
