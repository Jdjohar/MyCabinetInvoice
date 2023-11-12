import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';

export default function Timeview() {
  const [loading, setloading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [userEntries, setUserEntries] = useState([]);
  const currentDate = new Date();
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [entriesPerPage] = useState(10); // Number of entries per page
if(location == null || location.state == null || location.state.teamid == null)
{
    navigate('/userpanel/Team')
}
const teamid = location.state?.teamid;
useEffect(() => {
    if (!localStorage.getItem('authToken') || localStorage.getItem("isTeamMember") == "true") {
      navigate('/');
    }
    fetchAllEntries();
  }, []);

  const fetchAllEntries = async () => {
    try {
      // Calculate the start and end timestamps for the current month
      const currentMonthIndex = currentDate.getMonth(); // Get the current month (0-indexed)
      const currentYear = currentDate.getFullYear();
      const startOfMonth = new Date(currentYear, currentMonthIndex, 1, 0, 0, 0);
      const endOfMonth = new Date(currentYear, currentMonthIndex + 1, 0, 23, 59, 59);

      const response = await fetch(`https://invoice-n96k.onrender.com/api/userEntries/${teamid}`);
      const data = await response.json();

      // Filter userEntries to include only entries for the current month
      const filteredEntries = data.userEntries.filter((entry) => {
        const entryTime = new Date(entry.startTime).getTime();
        return entryTime >= startOfMonth.getTime() && entryTime <= endOfMonth.getTime();
      });

      setUserEntries(filteredEntries);

      setTimeout(() => {
        setloading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

const GoToHistory = () => {
    navigate('/Timeschemahistory', { state: { teamid } });
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the index of the first and last entry to display on the current page
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = userEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  

  return (
    <div className='bg'>
      <div className='container-fluid'>
      {loading ? (
        <div className="row">
          <ColorRing
            loading={loading}
            display="flex"
            justify-content="center"
            align-items="center"
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none">
            <div>
              <Usernavbar />
            </div>
          </div>

          <div className="col-lg-10 col-md-9 col-12 mx-auto">
            <div className="row my-4 mx-5">
                <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                  <p className="h5 fw-bold">Current Month</p>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                  <button className="btn rounded-pill btnclr text-white fw-bold" onClick={GoToHistory}>
                    History
                  </button>
                </div>
              <hr />

              <div className="box1 rounded adminborder pt-3 text-center">
                <div className="row">
                  <div className="col-2">
                    <p>Start Time</p>
                  </div>
                  <div className="col-2">
                    <p>End Time</p>
                  </div>
                  <div className="col-2">
                    <p>Start Date</p>
                  </div>
                  <div className="col-2">
                    <p>End Date</p>
                  </div>
                  <div className="col-4">
                    <p>Total Time</p>
                  </div>
                </div>

                {currentEntries.map((entry) => (
                  <div className="row" key={entry._id}>
                    <div className="col-2">
                      <p>{new Date(entry.startTime).toLocaleTimeString()}</p>
                    </div>
                    <div className="col-2">
                      <p>{entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : '--'}</p>
                    </div>
                    <div className="col-2">
                      <p>{new Date(entry.startTime).toLocaleDateString()}</p>
                    </div>
                    <div className="col-2">
                      <p>{entry.endTime ? new Date(entry.endTime).toLocaleDateString() : '--'}</p>
                    </div>
                    <div className="col-4">
                      <p>{entry.totalTime}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination component */}
              <div className="pagination justify-content-end">
                {Array(Math.ceil(userEntries.length / entriesPerPage))
                  .fill(null)
                  .map((_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
