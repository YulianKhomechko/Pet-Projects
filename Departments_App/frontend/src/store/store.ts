import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import departmentsReducer from './departmentsSlice';
import employeesReducer from './employeesSlice';
import modalReducer from './modalSlice';
import chatsReducer from './chatsSlice';

export const rootReducer = combineReducers({
    modal: modalReducer,
    departments: departmentsReducer,
    employees: employeesReducer,
    auth: authReducer,
    chats: chatsReducer
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'chats']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState
    });
};

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
