import React from 'react';
import './Button.scss';

type ButtonProps = React.HTMLProps<HTMLButtonElement> & {
    type?: 'button' | 'submit' | 'reset';
    'data-testid'?: string;
};

export default React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    return (
        <button
            type={props.type || 'button'}
            className={`btn ${props.className}`}
            onClick={props.onClick}
            ref={ref}
            data-testid={props['data-testid']}>
            {props.children}
        </button>
    );
});
