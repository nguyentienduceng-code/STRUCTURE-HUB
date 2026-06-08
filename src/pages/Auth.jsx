import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import Card from '../components/Card';

export default function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Status states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simple email regex validation
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Định dạng email không hợp lệ.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Fetch users from localStorage
      const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        // If localStorage is empty, let's create a default admin account
        if (email.toLowerCase() === 'engineer@structurehub.com' && password === '123456') {
          const defaultUser = { name: 'Kỹ sư Kết cấu', email: 'engineer@structurehub.com' };
          localStorage.setItem('sh_user_session', JSON.stringify(defaultUser));
          setSuccess('Đăng nhập thành công! Đang chuyển hướng...');
          setIsLoading(false);
          // Dispatch a custom event to notify App.jsx of login change
          window.dispatchEvent(new Event('authChange'));
          setTimeout(() => navigate('/'), 1200);
          return;
        }
        setError('Tài khoản không tồn tại. Vui lòng đăng ký mới.');
        setIsLoading(false);
        return;
      }

      if (user.password !== password) {
        setError('Mật khẩu không chính xác.');
        setIsLoading(false);
        return;
      }

      // Successful login
      const sessionUser = { name: user.name, email: user.email };
      localStorage.setItem('sh_user_session', JSON.stringify(sessionUser));
      setSuccess(`Chào mừng trở lại, ${user.name}!`);
      setIsLoading(false);
      window.dispatchEvent(new Event('authChange'));
      setTimeout(() => navigate('/'), 1200);
    }, 800);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Định dạng email không hợp lệ.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('sh_users') || '[]');
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

      if (userExists || email.toLowerCase() === 'engineer@structurehub.com') {
        setError('Email này đã được sử dụng.');
        setIsLoading(false);
        return;
      }

      // Add user
      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem('sh_users', JSON.stringify(users));

      // Auto login after registration
      const sessionUser = { name, email };
      localStorage.setItem('sh_user_session', JSON.stringify(sessionUser));

      setSuccess('Đăng ký tài khoản thành công!');
      setIsLoading(false);
      window.dispatchEvent(new Event('authChange'));
      setTimeout(() => navigate('/'), 1200);
    }, 1000);
  };

  return (
    <div className="auth-page-container">
      <style>{`
        .auth-page-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 120px);
          padding: 20px;
          animation: fadeIn 0.4s ease-out;
        }

        .auth-card {
          width: 100%;
          max-width: 450px;
          background: var(--bg-card);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius);
          box-shadow: var(--shadow-glow);
          backdrop-filter: blur(var(--glass-blur));
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
        }

        .auth-logo-section {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-logo-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: var(--accent-gradient);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
          margin-bottom: 12px;
        }

        .auth-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .auth-subtitle {
          font-size: 0.88rem;
          color: var(--text-secondary);
        }

        .auth-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 24px;
          border: 1px solid var(--border-glass);
        }

        .auth-tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .auth-tab-btn.active {
          background: var(--bg-secondary);
          color: var(--text-primary);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .auth-form-group {
          margin-bottom: 20px;
          position: relative;
        }

        .auth-input-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .auth-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          padding: 12px 40px 12px 44px;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .auth-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          background: rgba(0, 0, 0, 0.2);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
        }

        .auth-eye-btn {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
        }

        .auth-eye-btn:hover {
          color: var(--text-primary);
        }

        .auth-extra-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 24px;
        }

        .auth-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .auth-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--accent-primary);
        }

        .auth-forgot-link {
          color: var(--accent-primary);
          font-weight: 500;
        }

        .auth-forgot-link:hover {
          text-decoration: underline;
        }

        .auth-submit-btn {
          width: 100%;
          background: var(--accent-gradient);
          border: none;
          border-radius: 8px;
          padding: 14px;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.25);
          transition: all 0.3s ease;
        }

        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.35);
        }

        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-message {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 0.88rem;
          margin-bottom: 20px;
          line-height: 1.4;
          animation: slideDown 0.2s ease-out;
        }

        .auth-message.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--red);
        }

        .auth-message.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: var(--green);
        }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 24px 18px;
          }
        }
      `}</style>

      <div className="auth-card">
        <div className="auth-logo-section">
          <div className="auth-logo-badge">
            <Shield size={26} color="#ffffff" />
          </div>
          <h2 className="auth-title gradient-text">Structural Hub</h2>
          <p className="auth-subtitle">Hệ thống quản lý kiến thức & tiêu chuẩn kết cấu</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setError('');
              setSuccess('');
            }}
          >
            Đăng nhập
          </button>
          <button 
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setError('');
              setSuccess('');
            }}
          >
            Đăng ký
          </button>
        </div>

        {error && (
          <div className="auth-message error">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-message success">
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{success}</span>
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="auth-form-group">
              <label className="auth-input-label">Email</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-input-icon" size={18} />
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="engineer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-input-label">Mật khẩu</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-extra-actions">
              <label className="auth-checkbox-label">
                <input 
                  type="checkbox" 
                  className="auth-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#forgot" className="auth-forgot-link" onClick={(e) => { e.preventDefault(); setError('Tính năng khôi phục mật khẩu đang được phát triển.'); }}>
                Quên mật khẩu?
              </a>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              <span>{isLoading ? 'Đang xác thực...' : 'Đăng nhập'}</span>
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="auth-form-group">
              <label className="auth-input-label">Họ và tên</label>
              <div className="auth-input-wrapper">
                <User className="auth-input-icon" size={18} />
                <input 
                  type="text" 
                  className="auth-input" 
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-input-label">Email</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-input-icon" size={18} />
                <input 
                  type="email" 
                  className="auth-input" 
                  placeholder="engineer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-input-label">Mật khẩu</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  placeholder="Mật khẩu tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-input-label">Xác nhận mật khẩu</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon" size={18} />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  className="auth-input" 
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  className="auth-eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              <span>{isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}</span>
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
