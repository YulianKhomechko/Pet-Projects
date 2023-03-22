import { InformationCircleIcon, PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import Tippy from '@tippyjs/react';
import { useNavigate } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';
import { userRoles } from '../../../constants/userRoles';
import { selectAuth } from '../../../store/authSlice';
import { removeDepartment } from '../../../thunks/departmentsThunk';
import { Button } from '../../_common';
import classes from './DepartmentCard.module.scss';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { Department } from '../../../models/Department';

export default function DepartmentCard({ id, name, head, description }: Department) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { userRole } = useAppSelector(selectAuth);

    const onDelete = () => {
        dispatch(removeDepartment(id));
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes['department-card']}>
                <div className={classes['department-card__content']}>
                    <h3 className={classes['department-card__name']}>{name}</h3>
                    <h4 className={classes['department-card__head']}>{head}</h4>
                    <p className={classes['department-card__description']}>{description}</p>
                </div>
                <div className={classes['department-card__actions']}>
                    <Tippy content={'Details'}>
                        <Button
                            className="btn-success"
                            onClick={() => navigate(`/departments/${id}/details`)}
                            data-testid="department-details-button">
                            <InformationCircleIcon className="w-7 h-7" />
                        </Button>
                    </Tippy>
                    {[userRoles.admin, userRoles.head].includes(userRole!) && (
                        <Tippy content={'Edit'}>
                            <Button
                                className="btn-primary"
                                onClick={() => navigate(`/departments/${id}/edit`)}
                                data-testid="department-edit-button">
                                <PencilAltIcon className="w-7 h-7" />
                            </Button>
                        </Tippy>
                    )}
                    {[userRoles.admin].includes(userRole!) && (
                        <Tippy content={'Delete'}>
                            <Button className="btn-danger" onClick={onDelete} data-testid="department-delete-button">
                                <TrashIcon className="w-7 h-7" />
                            </Button>
                        </Tippy>
                    )}
                </div>
            </div>
        </div>
    );
}
