import { useState } from 'react';
import './AuthPage.css';

const getImageUrl = (url) => {
  if (!url) return '';
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${import.meta.env.BASE_URL || '/'}${cleanUrl}`;
};

function AuthPage({ onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const switchMode = () => {
    setIsAnimating(true);
    setErrors({});
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginEmail.trim()) newErrors.loginEmail = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) newErrors.loginEmail = 'Email inválido';
    if (!loginPassword) newErrors.loginPassword = 'La contraseña es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!regName.trim()) newErrors.regName = 'El nombre es obligatorio';
    if (!regEmail.trim()) newErrors.regEmail = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(regEmail)) newErrors.regEmail = 'Email inválido';
    if (!regPassword) newErrors.regPassword = 'La contraseña es obligatoria';
    else if (regPassword.length < 6) newErrors.regPassword = 'Mínimo 6 caracteres';
    if (regPassword !== regConfirmPassword) newErrors.regConfirmPassword = 'Las contraseñas no coinciden';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ form: data.error || 'Error al iniciar sesión' });
        setLoading(false);
        return;
      }

      const data = await res.json();
      onLogin(data.user);
    } catch {
      // Backend offline – simulate login
      console.warn('Backend offline, simulando inicio de sesión.');
      onLogin({ name: loginEmail.split('@')[0], email: loginEmail });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword
        })
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ form: data.error || 'Error al registrarse' });
        setLoading(false);
        return;
      }

      const data = await res.json();
      onLogin(data.user);
    } catch {
      // Backend offline – simulate registration
      console.warn('Backend offline, simulando registro.');
      onLogin({ name: regName, email: regEmail });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background decorative elements */}
      <div className="auth-bg-decoration">
        <div className="auth-bg-circle auth-bg-circle-1" />
        <div className="auth-bg-circle auth-bg-circle-2" />
        <div className="auth-bg-circle auth-bg-circle-3" />
      </div>

      <div className="auth-container">
        {/* Left panel – brand / illustration */}
        <div className="auth-brand-panel">
          <div className="auth-brand-overlay" />
          <div className="auth-brand-content">
            <img src={getImageUrl('images/logo.webp')} alt="Vinito y Pastas" className="auth-brand-logo" />
            <h1 className="auth-brand-title">VINITO <span>y</span> PASTAS</h1>
            <p className="auth-brand-tagline">Vinos Gourmet</p>
            <div className="auth-brand-divider" />
            <p className="auth-brand-slogan">
              Brindemos por los pequeños<br />grandes momentos
            </p>

            <div className="auth-brand-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">🍷</span>
                <span>Selección exclusiva de vinos argentinos</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">🚚</span>
                <span>Envíos a todo el país</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">🛡️</span>
                <span>Compra 100% segura</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel – form */}
        <div className="auth-form-panel">
          <div className={`auth-form-wrapper ${isAnimating ? 'auth-fade-out' : 'auth-fade-in'}`}>
            {/* Greeting */}
            <div className="auth-form-header">
              <div className="auth-header-top">
                <h2>{isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}</h2>
                {onBack && (
                  <button type="button" className="auth-close-btn" onClick={onBack} aria-label="Volver a la tienda">
                    ✕
                  </button>
                )}
              </div>
              <p>
                {isLogin
                  ? 'Ingresá a tu cuenta para descubrir nuestra colección'
                  : 'Unite a la comunidad de amantes del buen vino'}
              </p>
            </div>

            {/* Error banner */}
            {errors.form && (
              <div className="auth-error-banner">
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {errors.form}
              </div>
            )}

            {/* LOGIN FORM */}
            {isLogin ? (
              <form className="auth-form" onSubmit={handleLogin} noValidate>
                <div className={`auth-field ${errors.loginEmail ? 'has-error' : ''}`}>
                  <label htmlFor="login-email">Email</label>
                  <div className="auth-input-wrapper">
                    <svg className="auth-input-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  {errors.loginEmail && <span className="auth-field-error">{errors.loginEmail}</span>}
                </div>

                <div className={`auth-field ${errors.loginPassword ? 'has-error' : ''}`}>
                  <label htmlFor="login-password">Contraseña</label>
                  <div className="auth-input-wrapper">
                    <svg className="auth-input-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tu contraseña"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="auth-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.loginPassword && <span className="auth-field-error">{errors.loginPassword}</span>}
                </div>

                <div className="auth-form-options">
                  <label className="auth-remember">
                    <input type="checkbox" />
                    <span>Recordarme</span>
                  </label>
                  <a href="#forgot" className="auth-forgot-link" onClick={(e) => { e.preventDefault(); alert('¡Próximamente! Recuperación de contraseña.'); }}>
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="auth-spinner" />
                  ) : (
                    <>
                      Iniciar Sesión
                      <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form className="auth-form" onSubmit={handleRegister} noValidate>
                <div className={`auth-field ${errors.regName ? 'has-error' : ''}`}>
                  <label htmlFor="reg-name">Nombre completo</label>
                  <div className="auth-input-wrapper">
                    <svg className="auth-input-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                    <input
                      id="reg-name"
                      type="text"
                      placeholder="Juan Pérez"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                  {errors.regName && <span className="auth-field-error">{errors.regName}</span>}
                </div>

                <div className={`auth-field ${errors.regEmail ? 'has-error' : ''}`}>
                  <label htmlFor="reg-email">Email</label>
                  <div className="auth-input-wrapper">
                    <svg className="auth-input-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <input
                      id="reg-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  {errors.regEmail && <span className="auth-field-error">{errors.regEmail}</span>}
                </div>

                <div className="auth-field">
                  <label htmlFor="reg-phone">Teléfono <span className="auth-optional">(opcional)</span></label>
                  <div className="auth-input-wrapper">
                    <svg className="auth-input-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <input
                      id="reg-phone"
                      type="tel"
                      placeholder="+54 11 1234-5678"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className={`auth-field ${errors.regPassword ? 'has-error' : ''}`}>
                  <label htmlFor="reg-password">Contraseña</label>
                  <div className="auth-input-wrapper">
                    <svg className="auth-input-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    <input
                      id="reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="auth-toggle-password"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label={showRegPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showRegPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.regPassword && <span className="auth-field-error">{errors.regPassword}</span>}
                </div>

                <div className={`auth-field ${errors.regConfirmPassword ? 'has-error' : ''}`}>
                  <label htmlFor="reg-confirm-password">Confirmar contraseña</label>
                  <div className="auth-input-wrapper">
                    <svg className="auth-input-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <input
                      id="reg-confirm-password"
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Repetí tu contraseña"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.regConfirmPassword && <span className="auth-field-error">{errors.regConfirmPassword}</span>}
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="auth-spinner" />
                  ) : (
                    <>
                      Crear mi Cuenta
                      <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Switch link */}
            <div className="auth-switch">
              {isLogin ? (
                <p>
                  ¿No tenés cuenta?{' '}
                  <button type="button" className="auth-switch-btn" onClick={switchMode}>
                    Registrate gratis
                  </button>
                </p>
              ) : (
                <p>
                  ¿Ya tenés cuenta?{' '}
                  <button type="button" className="auth-switch-btn" onClick={switchMode}>
                    Iniciá sesión
                  </button>
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="auth-divider">
              <span>o continuá con</span>
            </div>

            {/* Social login */}
            <div className="auth-social-buttons">
              <button type="button" className="auth-social-btn" onClick={() => alert('¡Próximamente! Login con Google')}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
