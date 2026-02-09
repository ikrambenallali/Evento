'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../features/store';
import { loginSuccess } from '../features/authSlice';

function InitializeAuth({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        // Restore token from localStorage on app initialization
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            try {
                dispatch(loginSuccess({
                    token,
                    user: JSON.parse(user)
                }));
            } catch (error) {
                console.error('Failed to restore auth state:', error);
            }
        }
    }, [dispatch]);

    return children;
}

export default function ReduxProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <InitializeAuth>{children}</InitializeAuth>
        </Provider>
    );
}
