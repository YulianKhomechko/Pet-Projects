import { XIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import reactDOM from 'react-dom';
import {
    modalConfirm,
    modalCreateSuccess,
    modalDeleteSuccess,
    modalEditSuccess,
    modalError,
    modalInfo,
    modalSuccess
} from '../../../constants/modalTypes';
import { hideModal, selectModal } from '../../../store/modalSlice';
import Button from '../Button/Button';
import classes from './Modal.module.scss';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';

export default function Modal() {
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    let { type, title, text, action, modalIsVisible } = useAppSelector(selectModal);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!modalIsVisible) {
            return;
        }
        if (modalIsVisible && timer) {
            clearTimeout(timer);
            setTimer(undefined);
        }
        setTimer(setTimeout(() => dispatch(hideModal()), 4000));

        return () => clearTimeout(timer);
    }, [modalIsVisible, title, text]);

    const hideModalHandler = () => {
        dispatch(hideModal());
    };
    const confirmHandler = () => {
        dispatch(hideModal());
        action && action();
    };

    if (!title && type === modalError) title = 'An Error Occurred.';
    if (!title && type === modalConfirm) title = 'Confirm Action.';
    if (!title && type === modalSuccess) title = 'Operation Accomplished!';
    if (!title && type === modalCreateSuccess) title = `Created Successfully`;
    if (!title && type === modalEditSuccess) title = `Edited Successfully`;
    if (!title && type === modalDeleteSuccess) title = `Deleted Successfully`;

    if (!text && type === modalError) text = 'An error occurred. Please try again later...';
    if (!text && type === modalConfirm) text = 'Are you sure you want to perform this action?';

    return (
        <>
            {reactDOM.createPortal(
                <div className={`${classes['content']} ${modalIsVisible ? classes['show-modal'] : null}`}>
                    <button className={classes.close} onClick={hideModalHandler}>
                        <XIcon className="w-7 h-7" />
                    </button>
                    <h2 className={classes.title}>{title}</h2>
                    {text && <p className={classes.text}>{text}</p>}

                    <div className={`${classes.actions} mt-4`}>
                        {(type === modalInfo ||
                            type === modalSuccess ||
                            type === modalEditSuccess ||
                            type === modalCreateSuccess ||
                            type === modalDeleteSuccess) && (
                            <Button className="btn-primary" onClick={hideModalHandler}>
                                Got it
                            </Button>
                        )}
                        {type === modalError && (
                            <Button className="btn-danger" onClick={hideModalHandler}>
                                OK
                            </Button>
                        )}
                        {type === modalConfirm && (
                            <>
                                <Button className="btn-danger" onClick={hideModalHandler}>
                                    Cancel
                                </Button>
                                <Button className="btn-primary" onClick={confirmHandler}>
                                    Confirm
                                </Button>
                            </>
                        )}
                    </div>
                </div>,
                document.getElementById('modal-root')!
            )}
        </>
    );
}
