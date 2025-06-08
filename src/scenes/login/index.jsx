import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { validarAdmin } from '../../api/login';
import backgroundImage from '../../assets/images/reservatec.jpg';
import tecsupLogo from '../../assets/images/tecsup.png';
import { EventAvailable } from '@mui/icons-material';

const Login = () => {
  const [loginKey, setLoginKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) navigate('/');
  }, [navigate]);

  useEffect(() => {
    const logoutFlag = sessionStorage.getItem('logout_done');
    if (logoutFlag) {
      setLoginKey(prev => prev + 1);
      sessionStorage.removeItem('logout_done');
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const decoded = jwtDecode(idToken);

      const response = await validarAdmin({
        email: decoded.email,
        name: decoded.name,
        photo: decoded.picture,
      });

      const { token, ...rest } = response.data;
      if (!token) throw new Error('Token no recibido');

      localStorage.setItem('auth', JSON.stringify({ token, ...rest }));
      navigate('/');
    } catch (error) {
      alert('Acceso denegado o error de autenticación');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header fijo en la parte superior */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 10,
        }}
      >
        <img
          src={tecsupLogo}
          alt="Tecsup"
          style={{
            height: '200%',
            maxHeight: '200px',
            maxWidth: '200%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Caja de login centrada */}
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '2.5rem 2rem',
            borderRadius: '16px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
            width: '100%',
            maxWidth: 'clamp(280px, 80vw, 340px)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 5,
          }}
        >
          <EventAvailable
            style={{
              fontSize: 60,
              color: '#333',
              marginBottom: '0rem',
            }}
          />
          <h2
            style={{
              color: '#222',
              marginBottom: '1.5rem',
              fontSize: '1.6rem',
              fontWeight: '600',
            }}
          >
            Reservatec Admin
          </h2>
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <GoogleLogin
              key={loginKey}
              onSuccess={handleLoginSuccess}
              useOneTap={false}
              theme="outline"
              shape="pill"
              text="continue_with"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );

};

export default Login;
