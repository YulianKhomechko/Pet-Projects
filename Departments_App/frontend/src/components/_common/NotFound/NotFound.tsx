import { useNavigate } from 'react-router-dom';
import { Button } from '../index';
import classes from './NotFound.module.scss';

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className={classes['error']}>
            <h2 className={classes['error__status-code']}>404</h2>
            <div className={classes['error__content']}>
                <h2 className={classes['error__message']}>Page Not Found</h2>
                <p className={classes['error__advice']}>Please, check the URL in address bar and try again.</p>
                <Button className={`${classes['error__button']} btn-primary`} onClick={() => navigate('/departments')}>
                    Go back home
                </Button>
            </div>
        </div>
    );
}
