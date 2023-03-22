import { createSlice } from '@reduxjs/toolkit';
import { modalError } from '../constants/modalTypes';
import { isThunkRejected } from './helpers/reducerMatcherFunctions';
import type { RootState } from './store';

interface ModalState {
    modalIsVisible: boolean;
    type: string;
    title: string | undefined;
    text: string | undefined;
    action: (() => void) | null | undefined;
    error: string;
}

const initialState: ModalState = {
    modalIsVisible: false,
    type: '',
    title: '',
    text: '',
    action: null,
    error: ''
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showModal: (
            state,
            { payload }: { payload: { type: string; title?: string; text?: string; action?: () => void } }
        ) => {
            state.modalIsVisible = true;
            state.type = payload.type;
            state.title = payload.title;
            state.text = payload.text;
            state.action = payload.action;
        },
        hideModal: (state) => {
            state.modalIsVisible = false;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(isThunkRejected, (state, action) => {
            state.modalIsVisible = true;
            state.type = modalError;
            state.text = action.error.name !== 'TypeError' ? action.error.message : null;
        });
    }
});

export const selectModal = (state: RootState) => state.modal;

export const { showModal, hideModal } = modalSlice.actions;

export default modalSlice.reducer;
