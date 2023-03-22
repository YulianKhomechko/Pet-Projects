import '@testing-library/jest-dom/extend-expect';
import { screen } from '@testing-library/react';
import DepartmentCard from './DepartmentCard';
import { renderWithProviders } from '../../../utils/testing-utils/renderWithProviders';
import { userRoles } from '../../../constants/userRoles';
import { generateAuthState } from '../../../utils/testing-utils/testState';
import userEvent from '@testing-library/user-event';
import { testHistory } from '../../../utils/testing-utils/history';
import * as ReduxHooks from '../../../store/hooks';

describe('DepartmentCard', () => {
    const testId = 1;
    const testName = 'test department';
    const testHead = 'test head';

    describe('department-details-button', () => {
        it('should SHOW department details button.', () => {
            renderWithProviders(<DepartmentCard id={testId} name={testName} head={testHead} />);

            expect(screen.getByTestId('department-details-button')).toBeInTheDocument();
        });

        it('should NAVIGATE to "/departments/:departmentId/details when clicked"', () => {
            renderWithProviders(<DepartmentCard id={testId} name={testName} head={testHead} />);

            userEvent.click(screen.getByTestId('department-details-button'));

            expect(testHistory.location.pathname).toBe(`/departments/${testId}/details`);
        });
    });

    describe('department-edit-button', () => {
        it('should NOT SHOW this button if user role is "user"', () => {
            renderWithProviders(<DepartmentCard id={testId} name={testName} head={testHead} />, {
                preloadedState: {
                    auth: generateAuthState(userRoles.user)
                }
            });

            expect(screen.queryByTestId('department-edit-button')).not.toBeInTheDocument();
        });

        it('should SHOW this button if user role is "head"', () => {
            renderWithProviders(<DepartmentCard id={testId} name={testName} head={testHead} />, {
                preloadedState: {
                    auth: generateAuthState(userRoles.head)
                }
            });

            expect(screen.getByTestId('department-edit-button')).toBeInTheDocument();
        });

        it('should SHOW this button if user role is "admin"', () => {
            renderWithProviders(<DepartmentCard id={testId} name={testName} head={testHead} />, {
                preloadedState: {
                    auth: generateAuthState(userRoles.admin)
                }
            });

            expect(screen.getByTestId('department-edit-button')).toBeInTheDocument();
        });

        it('should NAVIGATE to "/departments/:departmentId/edit when clicked"', () => {
            renderWithProviders(<DepartmentCard id={testId} name={testName} head={testHead} />, {
                preloadedState: {
                    auth: generateAuthState(userRoles.head)
                }
            });

            userEvent.click(screen.getByTestId('department-edit-button'));

            expect(testHistory.location.pathname).toBe(`/departments/${testId}/edit`);
        });
    });

    describe('department-delete-button', () => {
        afterEach(() => {
            // restore the spy created with spyOn
            jest.restoreAllMocks();
        });

        it('should NOT SHOW this button if user role is "user"', () => {
            renderWithProviders(<DepartmentCard id={testId} name={testName} head={testHead} />, {
                preloadedState: {
                    auth: generateAuthState(userRoles.user)
                }
            });

            expect(screen.queryByTestId('department-delete-button')).not.toBeInTheDocument();
        });

        it('should NOT SHOW this button if user role is "head"', () => {
            renderWithProviders(<DepartmentCard id={testId} name={testName} head={testHead} />, {
                preloadedState: {
                    auth: generateAuthState(userRoles.head)
                }
            });

            expect(screen.queryByTestId('department-delete-button')).not.toBeInTheDocument();
        });

        it('should SHOW this button if user role is "admin"', () => {
            renderWithProviders(<DepartmentCard id={testId} name={testName} head={testHead} />, {
                preloadedState: {
                    auth: generateAuthState(userRoles.admin)
                }
            });

            expect(screen.getByTestId('department-delete-button')).toBeInTheDocument();
        });

        it('should CALL dispatch when clicked', () => {
            const mockedUseAppDispatch = jest.spyOn(ReduxHooks, 'useAppDispatch');

            renderWithProviders(<DepartmentCard id={testId} name={testName} head={testHead} />, {
                preloadedState: {
                    auth: generateAuthState(userRoles.admin)
                }
            });

            userEvent.click(screen.getByTestId('department-delete-button'));

            expect(mockedUseAppDispatch).toBeCalledTimes(1);
        });

        it('should HAVE class"btn-danger"', () => {
            renderWithProviders(<DepartmentCard id={testId} name={testName} head={testHead} />, {
                preloadedState: {
                    auth: generateAuthState(userRoles.admin)
                }
            });

            const { classList } = screen.getByTestId('department-delete-button');

            expect(classList.contains('btn-danger')).toBeTruthy();
        });
    });
});
