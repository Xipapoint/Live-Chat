import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $api from '../../../http/auth'; // Импортируйте настроенный Axios экземпляр
import styles from './AuthForm.module.scss';
import { useAppDispatch } from '../../../shared/hooks/redux';
import {authSlice} from '../../../store/reducers/authSlice';
import { IJwtResponse } from '../../dto/response/jwt/jwtResponse';
import useErrorToast from '../../../shared/hooks/toast';
import { Bounce, ToastContainer } from 'react-toastify';



interface ILoginFormProps {}

const LoginForm: React.FC<ILoginFormProps> = () => {
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    nickname: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {login} = authSlice.actions
  const { handleError} = useErrorToast()



  const validateForm = (): boolean => {
    let isValid = true;
    setFirstNameError('');
    setLastNameError('');
    setPasswordError('');

    if (firstName.trim().length === 0) {
      setFirstNameError('First name must be filled');
      isValid = false;
    }
    if (lastName.trim().length === 0) {
      setLastNameError('Last name must be filled');
      isValid = false;
    }
    if (password.trim().length === 0) {
      setPasswordError('Password must be filled');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!validateForm()) return
    setLoading(true);

    try {
      const response = await $api.post<IJwtResponse>('/login', {
        firstName,
        lastName,
        password,
      });

      if (response.status === 200) {
        const responseData = response.data;

        dispatch(login(responseData.userId));
        localStorage.setItem('auth', 'true');
        localStorage.setItem('userId', responseData.userId);

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }

        navigate('/chat');
      }
    } catch (error) {
      console.log(error);
      
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authBlock}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className={styles.inputWrapper}>
          {firstNameError && <p className={styles.inputError}>{firstNameError}</p>}
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className={styles.inputWrapper}>
          {lastNameError && <p className={styles.inputError}>{lastNameError}</p>}
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className={styles.inputWrapper}>
          {passwordError && <p className={styles.inputError}>{passwordError}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label style={{ marginLeft: '8px' }}>Remember me</label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        />
    </div>
  );
};

export default LoginForm;
