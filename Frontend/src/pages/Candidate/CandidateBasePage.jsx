import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CandidateViewRoundDetailsPage from './CandidateViewRoundDetailsPage';
import "./Styles/CandidateBasePage.css";
import companyLogo from "./images/Empowerin-Logo.png";
import Abstraction from "./images/Abstraction.png";
import backendURL from '../../baseURL';

function CandidateBasePage() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);

    useEffect(() => {
        checkPasswordChangeRequired();
    }, []);

    const checkPasswordChangeRequired = async () => {
        try {
            const email = localStorage.getItem('email');
            const token = localStorage.getItem('token');
            const response = await axios.get(`${backendURL}/api/candidate/check-password-change/${email}`, {
                headers: {
                    Authorization: token,
                }
            });
            setRequiresPasswordChange(response.data.requiresPasswordChange);
        } catch (error) {
            console.error(error);
        };
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${backendURL}/api/candidate/first-login-change-password`, {
                email,
                password
            }, {
                headers: {
                    Authorization: token,
                }
            });
            setMessage(response.data.message);
            setRequiresPasswordChange(false);
        } catch (error) {
            setMessage('Password change failed');
            console.error(error);
        };
    };

    return (
        <div>
            {requiresPasswordChange ? (
                <div className='password-page-main'>
                    <div className="company-logo">
                        <img src={companyLogo} alt="Empower Logo" />
                    </div>
                    <div className='main-form-layout'>
                        <h2 className='password-name-header'>Change <br />Password</h2> <br />
                        <form onSubmit={handlePasswordChange}>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="submit">Change Password</button>
                        </form>
                        <p>{message}</p>
                    </div>
                    <div className="abstraction-logo">
                        <img src={Abstraction} alt="Abstraction Logo" />
                    </div>
                </div>
            ) : (
                <div>
                    <CandidateViewRoundDetailsPage />
                </div>
            )}
        </div>
    );
}

export default CandidateBasePage;