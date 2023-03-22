import React, { PropsWithChildren } from 'react';
import { PreloadedState } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import { AppStore, RootState, setupStore } from '../../store/store';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { testHistory } from './history';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>;
    store?: AppStore;
}

export function renderWithProviders(
    ui: React.ReactElement,
    { preloadedState = {}, store = setupStore(preloadedState), ...renderOptions }: ExtendedRenderOptions = {}
) {
    function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
        return (
            <Provider store={store}>
                <Router location="/" navigator={testHistory}>
                    {children}
                </Router>
            </Provider>
        );
    }

    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
