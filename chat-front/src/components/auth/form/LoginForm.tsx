import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $api from '../../../http/auth'; // Импортируйте настроенный Axios экземпляр
import styles from './Register.module.scss';

interface ILoginFormProps {}

const LoginForm: React.FC<ILoginFormProps> = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await $api.post('/login', {
        firstName,
        lastName,
        password,
      });

      if (response.status === 200) {
        navigate('/chat');
      }
    } catch (error) {
        <p>Error: error</p>;
    }
  };

  return (
    <div className={styles.registerBlock}>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
      <h2>Login</h2>
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

      <div style={{display: 'flex'}}>
        <input type="checkBox" value={rememberMe} onChange={(e => setRememberMe(e.target.value))} required/>
        <label>Remember me</label>
      </div>
      <button type="submit">Login</button>
    </form>
    </div>
    
  );
};

export default LoginForm;
