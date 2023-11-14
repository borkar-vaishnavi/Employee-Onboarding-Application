import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./HeadHRStyles/HeadHRAssignmentStyles.css";
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/features/alertSlice';
import backendURL from '../../baseURL';

const HeadHRAssignment = () => {

    const [candidates, setCandidates] = useState([]);
    const [hrs, setHRs] = useState([]);
    const [selectedHR, setSelectedHR] = useState('');
    const [rounds, setRounds] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {
        fetchCandidates();
        fetchHRs();
    }, []);

    const fetchCandidates = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${backendURL}/api/admin/getCandidates`, {
                headers: {
                    Authorization: token,
                }
            });
            setCandidates(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchHRs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${backendURL}/api/admin/getHRs`, {
                headers: {
                    Authorization: token,
                }
            });
            setHRs(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAssignHR = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            dispatch(showLoading());
            await axios.post(`${backendURL}/api/admin/assign-hr/${userId}`, { hrId: selectedHR }, {
                headers: {
                    Authorization: token,
                }
            });
            dispatch(hideLoading());
            fetchCandidates();
        } catch (error) {
            dispatch(hideLoading());
            console.error(error);
        }
    };

    const handleUpdateRounds = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            dispatch(showLoading());
            await axios.post(`${backendURL}/api/admin/update-rounds/${userId}`, { rounds }, {
                headers: {
                    Authorization: token,
                }
            });
            dispatch(hideLoading());
            fetchCandidates();
        } catch (error) {
            dispatch(hideLoading());
            console.error(error);
        }
    };

    return (
        <div className='main-hr-assignment-page'>
            <div className='assignment-header'>
                <h3>Assignment</h3>
            </div>
            <ul>
                {candidates.map((candidate) => (
                    <div className="candidate-box" key={candidate._id}>
                        <div className="candidate-picture">
                            <img src={candidate.photo} alt="Candidate Photo" />
                        </div>
                        <div className="candidate-info">
                            <p>Name: {candidate.name}</p>
                            <p>Assigned HR: {candidate.assignedHR ? candidate.assignedHR.name : 'Not Assigned'}</p>
                            <p>Interview Rounds: {candidate.rounds}</p>
                        </div>
                        <div>
                            <div className="input-container">
                                <select className="selectHR" value={selectedHR} onChange={(e) => setSelectedHR(e.target.value)}>
                                    <option value="">Select HR</option>
                                    {hrs.map((hr) => (
                                        <option key={hr._id} value={hr._id}>{hr.name}</option>
                                    ))}
                                </select>
                                <button className="button-1" onClick={() => handleAssignHR(candidate._id)}>Assign HR</button>
                            </div>
                            <div className="input-container">
                                <input className="rounds" type="number" value={rounds} onChange={(e) => setRounds(e.target.value)} />
                                <button className="button-2" onClick={() => handleUpdateRounds(candidate._id)}>Update Rounds</button>
                            </div>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default HeadHRAssignment;