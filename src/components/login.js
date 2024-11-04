import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
    const [nrp, setNrp] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // In Login.js
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log('Attempting login with:', { nrp, password });
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nrp, password }),
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                setPopupMessage(data.message || "Login failed");
                setIsError(true);
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000);
                return;
            }

            // Success handling...

        } catch (error) {
            console.error('Login error:', error);
            setPopupMessage("An error occurred. Please try again.");
            setIsError(true);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        }
    };

    const handleGuestClick = (e) => {
        e.preventDefault();
        console.log('Guest login clicked');
        window.location.href = "https://youtu.be/GHEx6uCO80w?si=q616o1moyNDyhmRP";
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <header>Login</header>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="NRP"
                            value={nrp}
                            onChange={(e) => setNrp(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="input-box">
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="forgot">
                        <section>
                            <input
                                type="checkbox"
                                id="check"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            <label htmlFor="check">Remember me</label>
                        </section>
                    </div>

                    <div className="input-submit">
                        <button
                            type="submit"
                            className="submit-btn"
                            id="submit"
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="guest-link" style={{ textAlign: 'center' }}>
                        <p>
                            Don't have an account?{' '}
                            <a
                                href="#"
                                onClick={handleGuestClick}
                                rel="noopener noreferrer"
                            >
                                Join as a Guest
                            </a>
                        </p>
                    </div>
                </form>
            </div>

            {showPopup && (
                <div className={`popup ${isError ? 'error' : 'success'}`}>
                    {popupMessage}
                </div>
            )}
        </div>
    );
};

export default Login;