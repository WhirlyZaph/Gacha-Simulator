import React, { useState } from 'react';
import 'C:/Users/daber/OneDrive/Documents/ITSNEEDS/gacha/gacha-sim/src/index.css';
import '../styles/Login.css';


const Login = () => {
    const [nrp, setNrp] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', { nrp, password, remember });
        alert('Login successful!');
    };

    const handleGuestClick = (e) => {
        e.preventDefault();
        console.log('Guest login clicked');
        alert('Welcome, Guest!');
    };

    return (
        <div className="login-box">
            <div className="login-header">
                <h1>Login</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="text"
                        value={nrp}
                        onChange={(e) => setNrp(e.target.value)}
                        className="input-field"
                        placeholder="NRP"
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="remember-me">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    <label htmlFor="remember">Remember me</label>
                </div>
                <div className="input-submit">
                    <button type="submit" className="submit-btn">Sign In</button>
                </div>
            </form>
            <div className="guest-link">
                <p>
                    Don't have an account? <a href="#" onClick={handleGuestClick}>Join as a Guest</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
