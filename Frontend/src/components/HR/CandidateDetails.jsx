import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "./Styles/CandidateDetailsStyles.css";
import backendURL from "../../baseURL";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";

const HRViewCandidate = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [detailsInput, setDetailsInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${backendURL}/api/hr/candidate/${candidateId}`, {
      headers: {
        Authorization: token,
      }
    })
      .then(response => {
        setCandidate(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [candidateId]);

  const handleUpdateRound = async (roundId) => {
    try {
      const token = localStorage.getItem('token');
      const updatedData = { name: nameInput, details: detailsInput };
      dispatch(showLoading());
      await axios.put(`${backendURL}/api/hr/round/${roundId}`, updatedData, {
        headers: {
          Authorization: token,
        }
      });
      dispatch(showLoading());
      const response = await axios.get(`${backendURL}/api/hr/candidate/${candidateId}`, {
        headers: {
          Authorization: token,
        }
      });
      dispatch(hideLoading());
      setCandidate(response.data);
      setNameInput("");
      setDetailsInput("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptRound = async (roundId) => {
    try {
      const token = localStorage.getItem('token');
      dispatch(showLoading());
      await axios.put(`${backendURL}/api/hr/round/${roundId}/accept`, {
        headers: {
          Authorization: token,
        }
      });
      dispatch(hideLoading());
      setCandidate(prevCandidate => ({
        ...prevCandidate,
        currentRound: prevCandidate.currentRound + 1,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectRound = async (roundId) => {
    try {
      const token = localStorage.getItem('token');
      dispatch(showLoading());
      await axios.put(`${backendURL}/api/hr/round/${roundId}/reject`, {
        headers: {
          Authorization: token,
        }
      });
      dispatch(hideLoading());
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  if (!candidate) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hr-candidate-main">
      <div className="main-box-inside">
        <h2>Candidate Details</h2> <br />
        <Link to={`/dashboard/HRChat/${candidate._id}`}>Chat</Link>
        <div className="photo">
          <img src={candidate.photo} alt="" />
        </div>
        <div className="hr-see-candidate-info">
          <p>Name: {candidate.name}</p>
          <p>Email: {candidate.email}</p>
        </div>
        <br />
        <p>Number Of Rounds: {candidate.rounds}</p>

        <h3>Interview Rounds</h3> <br />
        <div className="interview-rounds">
          {candidate.interviewRounds.map((round, index) => (
            <div className="interview-round" key={round._id}>
              <div className="round-detail-header">
                <p>Round {index + 1}: </p>
                <p>{round.name} </p>
              </div>
              <p>{round.details}</p>
              {index === candidate.currentRound - 1 && (
                <>
                  <form>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                    />
                    <input
                      type="text"
                      value={detailsInput}
                      onChange={e => setDetailsInput(e.target.value)}
                    />
                    <button className="update-button" type="button" onClick={() => handleUpdateRound(round._id)}>Update</button>
                  </form>
                  {round.attempted && (
                    <>
                      <button className="accept-button" onClick={() => handleAcceptRound(round._id)}>Accept</button>
                      <button className="reject-button" onClick={() => handleRejectRound(round._id)}>Reject</button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        {candidate.interviewClear == true && (<Link className="hr-onboarding-button" to={`/dashboard/HRViewCandidates/${candidate._id}/PersonalDetails`}>Onboarding</Link>)}
      </div>
    </div>
  );
};

export default HRViewCandidate;