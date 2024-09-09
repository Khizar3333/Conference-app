import { useMagic } from '@/hooks/MagicProvider';
import showToast from '@/utils/showToast';
import Spinner from '@/components/ui/Spinner';
import { RPCError, RPCErrorCode } from 'magic-sdk';
import { useState } from 'react';
import FormInput from '@/components/ui/FormInput';
import supabase from '@/lib/supabase'; // Supabase client

const EmailOTP = ({ token, setToken }: { token: string; setToken: (token: string) => void }) => {
  const { magic } = useMagic(); // Using Magic Link provider from your hooks
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [isLoginInProgress, setLoginInProgress] = useState<boolean>(false);

  // Handle the login process
  const handleLogin = async () => {
    // Validate email format
    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setEmailError(true);
      return;
    }

    try {
      setLoginInProgress(true);
      setEmailError(false);

      // Step 1: Proceed with Magic Link login
      const token = await magic?.auth.loginWithEmailOTP({ email });

      // Step 2: Rehydrate user session, retrieve metadata (like email)
      const metadata = await magic?.user.getInfo();

      if (!token || !metadata?.email) {
        throw new Error('Magic login failed or no email returned');
      }

      // Step 3: Save or update user data to Supabase after Magic login
      const { data, error } = await supabase
        .from('users') // Assuming a 'users' table in Supabase
        .upsert({ email: email }, { onConflict: 'email' }); // Avoid duplicates by using 'email' as the unique key

      if (error) {
        console.log(error);
        throw new Error('Failed to save user data to Supabase');
      }

      // Step 4: Set token in the state to indicate login success
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





// import { useMagic } from '@/hooks/MagicProvider';
// import showToast from '@/utils/showToast';
// import Spinner from '@/components/ui/Spinner';
// import { RPCError, RPCErrorCode } from 'magic-sdk';
// import { useState } from 'react';
// import FormInput from '@/components/ui/FormInput';
// import supabase from '@/lib/supabase'; // Ensure this import is correct

// const EmailOTP = ({ token, setToken }: { token: string; setToken: (token: string) => void }) => {
//   const { magic } = useMagic();
//   const [email, setEmail] = useState<string>('');
//   const [emailError, setEmailError] = useState<boolean>(false);
//   const [isLoginInProgress, setLoginInProgress] = useState<boolean>(false);


//   const handleLogin = async () => {
//     if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
//       setEmailError(true);
//       return;
//     }
  
//     try {
//       setLoginInProgress(true);
//       setEmailError(false);
  
//       // Call your API to add the user email
//       const response = await fetch('/api/registerUser', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });
  
//       const result = await response.json();
  
//       if (!response.ok || result.error) {
//         throw new Error(result.error || 'Failed to add user email');
//       }
  
//       // Proceed with Magic link login
//       const token = await magic?.auth.loginWithEmailOTP({ email });
  
//       // Rehydrate user session
//       const metadata = await magic?.user.getInfo();
//       console.log(metadata);
  
//       if (!token || !metadata?.publicAddress) {
//         throw new Error('Magic login failed');
//       }
  
//       setToken(token);
//       setEmail('');
//     } catch (e) {
//       console.error('Login error:', e);
//       if (e instanceof RPCError) {
//         switch (e.code) {
//           case RPCErrorCode.MagicLinkFailedVerification:
//           case RPCErrorCode.MagicLinkExpired:
//           case RPCErrorCode.MagicLinkRateLimited:
//           case RPCErrorCode.UserAlreadyLoggedIn:
//             showToast({ message: e.message, type: 'error' });
//             break;
//           default:
//             showToast({
//               message: 'Something went wrong. Please try again',
//               type: 'error',
//             });
//         }
//       } else if (e instanceof Error) {
//         showToast({
//           message: e.message,
//           type: 'error',
//         });
//       } else {
//         showToast({
//           message: 'An unknown error occurred',
//           type: 'error',
//         });
//       }
//     } finally {
//       setLoginInProgress(false);
//     }
//   };
  

//   // const handleLogin = async () => {
//   //   if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
//   //     setEmailError(true);
//   //     return;
//   //   }

//   //   try {
//   //     setLoginInProgress(true);
//   //     setEmailError(false);
//   //     const token = await magic?.auth.loginWithEmailOTP({ email });

//   //     // Rehydrates the user session whenever getInfo is invoked
//   //     const metadata = await magic?.user.getInfo();
//   //     console.log(metadata);

//   //     if (!token || !metadata?.publicAddress) {
//   //       throw new Error('Magic login failed');
//   //     }

//   //     // Save the user data to Supabase
//   //     const { data, error } = await supabase
//   //       .from('users')
//   //       .upsert({ email });

//   //     if (error) {
//   //       console.log(error);
//   //       throw new Error('Failed to save user data to Supabase');
//   //     }

//   //     setToken(token);
//   //     setEmail('');
//   //   } catch (e) {
//   //     console.error('Login error:', e);
//   //     if (e instanceof RPCError) {
//   //       switch (e.code) {
//   //         case RPCErrorCode.MagicLinkFailedVerification:
//   //         case RPCErrorCode.MagicLinkExpired:
//   //         case RPCErrorCode.MagicLinkRateLimited:
//   //         case RPCErrorCode.UserAlreadyLoggedIn:
//   //           showToast({ message: e.message, type: 'error' });
//   //           break;
//   //         default:
//   //           showToast({
//   //             message: 'Something went wrong. Please try again',
//   //             type: 'error',
//   //           });
//   //       }
//   //     }
//   //   } finally {
//   //     setLoginInProgress(false);
//   //   }
//   // };

//   return (
//     <div>
//       <FormInput
//         onChange={(e) => {
//           if (emailError) setEmailError(false);
//           setEmail(e.target.value);
//         }}
//         placeholder={token.length > 0 ? 'Already logged in' : 'Email'}
//         value={email}
//       />
//       {emailError && <span className="error">Enter a valid email</span>}
//       <button
//         disabled={isLoginInProgress || (token.length > 0 ? false : email.length === 0)}
//         onClick={handleLogin}
//       >
//         {isLoginInProgress ? <Spinner /> : 'Log in / Sign up'}
//       </button>
//     </div>
//   );
// };

// export default EmailOTP;


















// // import { useMagic } from '@/hooks/MagicProvider';
// // import showToast from '@/utils/showToast';
// // import Spinner from '../../ui/Spinner';
// // import { RPCError, RPCErrorCode } from 'magic-sdk';
// // import { LoginProps } from '@/utils/types';
// // import { saveUserInfo } from '@/utils/common';
// // import Card from '../../ui/Card';
// // import CardHeader from '../../ui/CardHeader';
// // import { useState } from 'react';
// // import FormInput from '@/components/ui/FormInput';

// // const EmailOTP = ({ token, setToken }: LoginProps) => {
// //   const { magic } = useMagic();
// //   const [email, setEmail] = useState('');
// //   const [emailError, setEmailError] = useState(false);
// //   const [isLoginInProgress, setLoginInProgress] = useState(false);

// //   const handleLogin = async () => {
// //     if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
// //       setEmailError(true);
// //     } else {
// //       try {
// //         setLoginInProgress(true);
// //         setEmailError(false);
// //         const token = await magic?.auth.loginWithEmailOTP({ email });
// //         // Rehydrates the user session whenever getInfo is invoked
// //         const metadata = await magic?.user.getInfo();
// //         console.log(metadata)

// //         if (!token || !metadata?.publicAddress) {
// //           throw new Error('Magic login failed');
// //         }

// //         setToken(token);
// //         saveUserInfo(token, 'EMAIL', metadata?.publicAddress);
// //         setEmail('');
// //       } catch (e) {
// //         console.log('login error: ' + JSON.stringify(e));
// //         if (e instanceof RPCError) {
// //           switch (e.code) {
// //             case RPCErrorCode.MagicLinkFailedVerification:
// //             case RPCErrorCode.MagicLinkExpired:
// //             case RPCErrorCode.MagicLinkRateLimited:
// //             case RPCErrorCode.UserAlreadyLoggedIn:
// //               showToast({ message: e.message, type: 'error' });
// //               break;
// //             default:
// //               showToast({
// //                 message: 'Something went wrong. Please try again',
// //                 type: 'error',
// //               });
// //           }
// //         }
// //       } finally {
// //         setLoginInProgress(false);
// //       }
// //     }
// //   };

// //   return (
// //     <Card>
// //       <CardHeader id="login">Email OTP Login</CardHeader>
// //       <div className="login-method-grid-item-container">
// //         <FormInput
// //           onChange={(e) => {
// //             if (emailError) setEmailError(false);
// //             setEmail(e.target.value);
// //           }}
// //           placeholder={token.length > 0 ? 'Already logged in' : 'Email'}
// //           value={email}
// //         />
// //         {emailError && <span className="error">Enter a valid email</span>}
// //         <button
// //           className="login-button"
// //           disabled={isLoginInProgress || (token.length > 0 ? false : email.length == 0)}
// //           onClick={() => handleLogin()}
// //         >
// //           {isLoginInProgress ? <Spinner /> : 'Log in / Sign up'}
// //         </button>
// //       </div>
// //     </Card>
// //   );
// // };

// // export default EmailOTP;
