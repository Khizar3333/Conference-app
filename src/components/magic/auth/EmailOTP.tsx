import { useMagic } from '@/hooks/MagicProvider';
import showToast from '@/utils/showToast';
import Spinner from '@/components/ui/Spinner';
import { RPCError, RPCErrorCode } from 'magic-sdk';
import { useState } from 'react';
import FormInput from '@/components/ui/FormInput';

const EmailOTP = ({ token, setToken }: { token: string; setToken: (token: string) => void }) => {
  const { magic } = useMagic(); 
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [isLoginInProgress, setLoginInProgress] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setEmailError(true);
      return;
    }

    try {
      setLoginInProgress(true);
      setEmailError(false);

      const token = await magic?.auth.loginWithEmailOTP({ email });
      const metadata = await magic?.user.getInfo();

      if (!token || !metadata?.email) {
        throw new Error('Magic login failed or no email returned');
      }

      // Use the API route to register the user
      const response = await fetch('/api/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register user');
      }

      setToken(token);
      setEmail('');
      showToast({ message: 'Login successful!', type: 'success' });
    } catch (e) {
      console.error('Login error:', e);
      if (e instanceof RPCError) {
        switch (e.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
          case RPCErrorCode.MagicLinkExpired:
          case RPCErrorCode.MagicLinkRateLimited:
          case RPCErrorCode.UserAlreadyLoggedIn:
            showToast({ message: e.message, type: 'error' });
            break;
          default:
            showToast({
              message: 'Something went wrong. Please try again.',
              type: 'error',
            });
        }
      } else if (e instanceof Error) {
        showToast({ message: e.message, type: 'error' });
      } else {
        showToast({
          message: 'An unknown error occurred',
          type: 'error',
        });
      }
    } finally {
      setLoginInProgress(false);
    }
  };

  return (
    <div>
      <FormInput
        onChange={(e) => {
          if (emailError) setEmailError(false);
          setEmail(e.target.value);
        }}
        placeholder={token.length > 0 ? 'Already logged in' : 'Email'}
        value={email}
      />
      {emailError && <span className="error">Enter a valid email</span>}
      <button
        disabled={isLoginInProgress || (token.length > 0 ? false : email.length === 0)}
        onClick={handleLogin}
      >
        {isLoginInProgress ? <Spinner /> : 'Log in / Sign up'}
      </button>
    </div>
  );
};

export default EmailOTP;
