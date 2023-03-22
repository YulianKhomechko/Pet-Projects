import { LoadingSpinner } from '../index';
import classes from './LoadingScreen.module.scss';
import React from 'react';

export default function LoadingScreen() {
    return (
        <div className={classes.screen}>
            <LoadingSpinner />
        </div>
    );
}
