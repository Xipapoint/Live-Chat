import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $api from '../../../http/auth'; // Импортируйте настроенный Axios экземпляр
import styles from './Register.module.scss';
import { useAppDispatch } from '../../../shared/hooks/redux';
import {authSlice} from '../../../store/reducers/authSlice';
import { IJwtResponse } from '../../dto/response/jwt/jwtResponse';

interface IRegisterFormProps {}

const RegisterForm: React.FC<IRegisterFormProps> = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const auth = useAppSelector(state => state.auth)
  const {login} = authSlice.actions

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await $api.post('/register', {
        firstName,
        lastName,
        password,
      });
      const responseData: IJwtResponse= response.data

      if (response.status === 200) {

        navigate('/chat');
        dispatch(login(responseData.userId))
        localStorage.setItem('auth', 'true')
        localStorage.setItem('userId', responseData.userId)
      }
    } catch (error) {
        <p>Error: error</p>;
    }
  };

  return (
    <div className={styles.registerBlock}>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
    </div>
    
  );
};

export default RegisterForm;
