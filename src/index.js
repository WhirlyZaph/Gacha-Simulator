import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // This should now work correctly.
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));


function LoginBox() {
  const handleSubmit = () => {
    window.location.href = "google.com";
  };

  return (
    <div className="login-box">
      <div className="login-header">
        <header>Login</header>
      </div>

      <div className="input-box">
        <input
          type="text"
          className="input-field"
          placeholder="NRP"
          autoComplete="off"
          required
        />
      </div>

      <div className="input-box">
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          autoComplete="off"
          required
        />
      </div>

      <div className="forgot">
        <section>
          <input type="checkbox" id="check" />
          <label htmlFor="check">Remember me</label>
        </section>
      </div>

      <div className="input-submit">
        <button className="submit-btn" id="submit" onClick={handleSubmit}></button>
        <label htmlFor="submit">Sign In</label>
      </div>

      <div className="guest-link" style={{ textAlign: 'center' }}>
        <p>Don't have account? {' '}
          <a
            href="https://youtu.be/GHEx6uCO80w?si=q616o1moyNDyhmRP"
            target="_blank"
            rel="noopener noreferrer"
          >
            Join as a Guest
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginBox;