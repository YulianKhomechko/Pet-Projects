import '@testing-library/jest-dom/extend-expect';
import { renderWithProviders } from '../../../utils/testing-utils/renderWithProviders';
import { generateAuthState } from '../../../utils/testing-utils/testState';
import { userRoles } from '../../../constants/userRoles';
import EmployeeCard from './EmployeeCard';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { testHistory } from '../../../utils/testing-utils/history';

describe('EmployeeCard', () => {
    const userTestId = 1;
    const testId = 1;
    const testDepartmentId = 1;
    const testFirstName = 'Yulian';
    const testLastName = 'Khomechko';
    const testBirthDate = '9/17/2000';
    const testEmail = 'test@gmail.com';
    const testSalary = 4242;

    const EmployeeCardWithValues = (
        <EmployeeCard
            id={testId}
            departmentId={testDepartmentId}
            firstName={testFirstName}
            lastName={testLastName}
            birthDate={testBirthDate}
            email={testEmail}
            salary={testSalary}
        />
    );

    describe('employee-chat-button', () => {
        it('should NOT SHOW chat button if userId and employeeId is the same', () => {
            renderWithProviders(EmployeeCardWithValues, {
                preloadedState: {
                    auth: generateAuthState(userRoles.user, userTestId)
                }
            });

            expect(screen.queryByTestId('employee-chat-button')).not.toBeInTheDocument();
        });

        it('should SHOW chat button if userId and employeeId differ', () => {
            const userTestId = 2;

            renderWithProviders(EmployeeCardWithValues, {
                preloadedState: {
                    auth: generateAuthState(userRoles.user, userTestId)
                }
            });

            expect(screen.getByTestId('employee-chat-button')).toBeInTheDocument();
        });
    });

    describe('employee-details-button', () => {
        it('should SHOW this button', () => {
            renderWithProviders(EmployeeCardWithValues);

            expect(screen.getByTestId('employee-details-button')).toBeInTheDocument();
        });

        it('should navigate to "/departments/:departmentId/employees/:employeeId/details" when clicked', () => {
            renderWithProviders(EmployeeCardWithValues);

            userEvent.click(screen.getByTestId('employee-details-button'));

            expect(testHistory.location.pathname).toBe(`/departments/${testDepartmentId}/employees/${testId}/details`);
        });
    });

    describe('employee-edit-button', () => {
        it('should NOT SHOW this button if user role is "user"', () => {
            renderWithProviders(EmployeeCardWithValues, {
                preloadedState: {
                    auth: generateAuthState(userRoles.user)
                }
            });

            expect(screen.queryByTestId('employee-edit-button')).not.toBeInTheDocument();
        });

        it('should SHOW this button if user role is "head"', () => {
            renderWithProviders(EmployeeCardWithValues, {
                preloadedState: {
                    auth: generateAuthState(userRoles.head)
                }
            });

            expect(screen.getByTestId('employee-edit-button')).toBeInTheDocument();
        });

        it('should SHOW this button if user role is "admin"', () => {
            renderWithProviders(EmployeeCardWithValues, {
                preloadedState: {
                    auth: generateAuthState(userRoles.admin)
                }
            });

            expect(screen.getByTestId('employee-edit-button')).toBeInTheDocument();
        });

        it('should NAVIGATE to "/departments/:departmentId/employees/:id/edit" when clicked', () => {
            renderWithProviders(EmployeeCardWithValues, {
                preloadedState: {
                    auth: generateAuthState(userRoles.head)
                }
            });

            userEvent.click(screen.getByTestId('employee-edit-button'));

            expect(testHistory.location.pathname).toBe(`/departments/${testDepartmentId}/employees/${testId}/edit`);
        });
    });

    describe('employee-delete-button', () => {
        it('should NOT SHOW this button if user role is "user"', () => {
            renderWithProviders(EmployeeCardWithValues, {
                preloadedState: {
                    auth: generateAuthState(userRoles.user)
                }
            });

            expect(screen.queryByTestId('employee-delete-button')).not.toBeInTheDocument();
        });

        it('should NOT SHOW this button if user role is "head"', () => {
            renderWithProviders(EmployeeCardWithValues, {
                preloadedState: {
                    auth: generateAuthState(userRoles.head)
                }
            });

            expect(screen.queryByTestId('employee-delete-button')).not.toBeInTheDocument();
        });

        it('should SHOW this button if user role is "admin"', () => {
            renderWithProviders(EmployeeCardWithValues, {
                preloadedState: {
                    auth: generateAuthState(userRoles.admin)
                }
            });

            expect(screen.getByTestId('employee-delete-button')).toBeInTheDocument();
        });
    });
});
