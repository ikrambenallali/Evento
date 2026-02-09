import '@testing-library/jest-dom'; // <- super important !
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../../(auth)/login/page';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/authSlice';
import { Provider } from 'react-redux';
import { useRouter } from 'next/navigation';

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  let store: any;
  let pushMock: jest.Mock;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { loading: false, error: null, user: null, token: null },
      },
    });

    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('renders email, password fields and button', () => {
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    expect(screen.getByPlaceholderText('votre@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SE CONNECTER/i })).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );

    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: '' });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });
});
