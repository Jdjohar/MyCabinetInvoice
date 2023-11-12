import React, { useState, useEffect } from 'react';
// import Usernavbar from './Usernavbar';
import Usernavbar from './userpanel/Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';

export default function Timeschemahistory() {
  const [loading, setloading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [userEntries, setUserEntries] = useState([]);
  const [uniqueMonths, setUniqueMonths] = useState([]); 
  const [currentPageByMonth, setCurrentPageByMonth] = useState({});
  const [entriesPerPage] = useState(10);
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
      // Fetch all entries for the merchant's team (teamid)
      const response = await fetch(`https://invoice-n96k.onrender.com/api/userEntries/${teamid}`);
      const data = await response.json();

      setUserEntries(data.userEntries);
      // Extract unique months from the entries
      const months = [...new Set(data.userEntries.map((entry) => new Date(entry.startTime).getMonth()))];
      setUniqueMonths(months);

      const initialPageByMonth = {};
      months.forEach((monthIndex) => {
        initialPageByMonth[monthIndex] = 0;
      });
      setCurrentPageByMonth(initialPageByMonth);

      setTimeout(() => {
        setloading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const paginate = (items, page, pageSize) => {
    const startIndex = page * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  };

  const changePageForMonth = (monthIndex, nextPage) => {
    setCurrentPageByMonth({
      ...currentPageByMonth,
      [monthIndex]: nextPage,
    });
  };

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
            <div className="row my-4 mx-3">
              <div className="text">
                <p>History</p>
              </div>

              <div className="box1 rounded adminborder pt-3 text-center">
                {uniqueMonths.map((monthIndex, index) => {
                  const monthEntries = userEntries.filter(
                    (entry) => new Date(entry.startTime).getMonth() === monthIndex
                  );
                  const monthName = new Date(monthEntries[0].startTime).toLocaleDateString('default', { month: 'long' });
                  const paginatedEntries = paginate(monthEntries, currentPageByMonth[monthIndex], entriesPerPage);

                  return (
<React.Fragment key={monthName}>
                      {index > 0 && <hr />}
                      <div className="row">
                        <div className="col-12">
                          <p>{monthName}</p>
                        </div>
                      </div>
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
                        <div className="col-3">
                          <p>Total Time</p>
                        </div>
                      </div>

                      {paginatedEntries.map((entry) => (
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
                          <div className="col-3">
                            <p>{entry.totalTime}</p>
                          </div>
                        </div>
                      ))}

                      {monthEntries.length > entriesPerPage && (
                        <div className="row">
                          <div className="col-12 ">
                            <button
                              onClick={() => changePageForMonth(monthIndex, currentPageByMonth[monthIndex] - 1)}
                              disabled={currentPageByMonth[monthIndex] === 0}
                            >
                              Previous Page
                            </button>
                            <button
                              onClick={() => changePageForMonth(monthIndex, currentPageByMonth[monthIndex] + 1)}
                              disabled={(currentPageByMonth[monthIndex] + 1) * entriesPerPage >= monthEntries.length}
                            >
                              Next Page
                            </button>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
