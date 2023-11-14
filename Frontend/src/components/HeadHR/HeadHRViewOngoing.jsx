import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./HeadHRStyles/ViewOngoingStyles.css";
import backendURL from '../../baseURL';

const HeadHRViewOngoing = () => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${backendURL}/api/admin/get-ongoing-candidates`, {
                headers: {
                    Authorization: token,
                }
            });
            setCandidates(response.data.candidates);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='hr-view-ongoing-candidates'>
            <h2>Ongoing Candidates</h2>
            {candidates.map(candidate => (
                <div className="candidate-box" key={candidate.email}>
                    <div className="candidate-photo">
                        <img src={candidate.photo} alt="Candidate" />
                    </div>
                    <div className="candidate-info">
                        <p><strong>Name:</strong> {candidate.name}</p>
                        <p><strong>Email:</strong> {candidate.email}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HeadHRViewOngoing;