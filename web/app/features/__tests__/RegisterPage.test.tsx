import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../../(auth)/register/page';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/authSlice';
import { Provider } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '../../lib/axios';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../lib/axios');

describe('RegisterPage', () => {
  let store: any;
  let pushMock: jest.Mock;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: { loading: false, error: null, user: null, token: null } },
    });

    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });



  it('toggles password and confirmPassword visibility', () => {
    render(
      <Provider store={store}>
        <RegisterPage />
      </Provider>
    );

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0] as HTMLInputElement;
    const confirmInput = screen.getAllByPlaceholderText('••••••••')[1] as HTMLInputElement;
    const buttons = screen.getAllByRole('button', { name: '' });

    expect(passwordInput.type).toBe('password');
    expect(confirmInput.type).toBe('password');

    fireEvent.click(buttons[0]);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(buttons[0]);
    expect(passwordInput.type).toBe('password');

    fireEvent.click(buttons[1]);
    expect(confirmInput.type).toBe('text');
    fireEvent.click(buttons[1]);
    expect(confirmInput.type).toBe('password');
  });




 it('calls API and redirects on successful registration', async () => {
  (api.post as jest.Mock).mockResolvedValue({
    data: {
      user: { id: '1', name: 'Test', email: 'test@test.com' },
      access_token: 'mock-token',
    },
  });

  // Mock localStorage
  Storage.prototype.setItem = jest.fn();

  render(
    <Provider store={store}>
      <RegisterPage />
    </Provider>
  );

  fireEvent.change(screen.getByPlaceholderText('Votre nom'), { target: { value: 'Test' } });
  fireEvent.change(screen.getByPlaceholderText('votre@email.com'), { target: { value: 'test@test.com' } });

  const passwordInputs = screen.getAllByPlaceholderText('••••••••');
  fireEvent.change(passwordInputs[0], { target: { value: '12345678' } }); // mot de passe
  fireEvent.change(passwordInputs[1], { target: { value: '12345678' } }); // confirmation

  fireEvent.click(screen.getByRole('button', { name: /S'INSCRIRE/i }));

  await waitFor(() => {
    expect(pushMock).toHaveBeenCalledWith('/events');
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
  });
});


  it('shows API error when registration fails', async () => {
    (api.post as jest.Mock).mockRejectedValue({
      response: { data: { message: 'Erreur serveur' } },
    });

    render(
      <Provider store={store}>
        <RegisterPage />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Votre nom'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('votre@email.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], { target: { value: '12345678' } });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], { target: { value: '12345678' } });

    fireEvent.click(screen.getByRole('button', { name: /S'INSCRIRE/i }));

    await waitFor(() => {
      expect(screen.getByText('Erreur serveur')).toBeInTheDocument();
    });
  });
});
