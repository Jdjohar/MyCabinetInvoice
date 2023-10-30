import React,{useState,useEffect} from 'react'
import { format } from 'date-fns';
import {useNavigate} from 'react-router-dom'

export default function Dashboard() {
    useEffect(() => {
        if(!localStorage.getItem("authToken"))
        {
          navigate("/");
        }
    }, [])
    let navigate = useNavigate();
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [totalTime, setTotalTime] = useState(0);
    const [userEntries, setUserEntries] = useState([]);
    const currentDate = new Date(); // Get the current date
  
    const currentMonth = format(currentDate, 'MMMM');

    const handleClockIn = async () => {
        try {
          let userid = localStorage.getItem('userid');
          let username = localStorage.getItem('username');
          let userEmail = localStorage.getItem('userEmail');
          let isTeamMember = localStorage.getItem('isTeamMember');

            const response = await fetch('https://invoice-n96k.onrender.com/api/clockin', {
              method: 'POST', // Use POST method for clock-in
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(
                {
                userid:userid,
                username:username,
                userEmail:userEmail,
                isTeamMember:isTeamMember
              }),
            });
            const data = await response.json();
            setIsClockedIn(true);
            setStartTime(data.startTime);
            localStorage.setItem("startTime", data.startTime);
          } catch (error) {
            console.error(error);
          }
        };

        const handleClockOut = async () => {
            try {
              let userid = localStorage.getItem('userid');
              let username = localStorage.getItem('username');
              let userEmail = localStorage.getItem('userEmail');
              let isTeamMember = localStorage.getItem('isTeamMember');
              const response = await fetch('https://invoice-n96k.onrender.com/api/clockout', {
                method: 'POST', // Use POST method for clock-out
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                  {
                  userid:userid,
                  username:username,
                  userEmail:userEmail,
                  isTeamMember:isTeamMember
                }),
              });
              const data = await response.json();
              setIsClockedIn(false);
              localStorage.setItem("startTime", "");
        
              if (startTime) {
                const startTimestamp = new Date(startTime).getTime();
                const endTimestamp = new Date(data.endTime).getTime();
                const timeDifference = endTimestamp - startTimestamp;
                const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
                const seconds = Math.floor((timeDifference / 1000) % 60);
                setTotalTime(`${hours} hrs ${minutes} mins ${seconds} secs`);
              }
            } catch (error) {
              console.error(error);
            }
          };

          useEffect(() => {
            const localstarttime = localStorage.getItem("startTime");
            if(localstarttime != undefined && localstarttime != null && localstarttime != "")
            {
              setStartTime(localstarttime);
              setIsClockedIn(true);
            }

            if (isClockedIn && startTime) {
              const interval = setInterval(() => {
                const currentTimestamp = new Date().getTime();
                const startTimestamp = new Date(startTime).getTime();
                const timeDifference = currentTimestamp - startTimestamp;
                const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
                const seconds = Math.floor((timeDifference / 1000) % 60);
                setTotalTime(`${hours} hrs ${minutes} mins ${seconds} secs`);
              }, 1000);
        
              return () => clearInterval(interval);
            } 
            else {
              setTotalTime('0 hrs 0 mins 0 secs');
            }
          }, [isClockedIn, startTime]);

          useEffect(() => {
            const fetchUserEntries = async () => {
              try {
                const userid = localStorage.getItem('userid');
                const response = await fetch(`https://invoice-n96k.onrender.com/api/userEntries/${userid}`);
                const data = await response.json();
                setUserEntries(data.userEntries);
              } catch (error) {
                console.error(error);
              }
            };
        
            fetchUserEntries();
          }, []);

// Regular expression to match hours, minutes, and seconds
const timePattern = /(\d+) hours (\d+) minutes (\d+) seconds/;

// Initialize variables for hours, minutes, and seconds
let totalHours = 0;
let totalMinutes = 0;
let totalSeconds = 0;

// Iterate through userEntries to extract and accumulate time
userEntries.forEach((entry) => {
  const match = entry.totalTime.match(timePattern);
  if (match) {
    totalHours += parseInt(match[1]);
    totalMinutes += parseInt(match[2]);
    totalSeconds += parseInt(match[3]);
  }
});

// Handle any overflow from seconds to minutes or minutes to hours
totalMinutes += Math.floor(totalSeconds / 60);
totalSeconds %= 60;
totalHours += Math.floor(totalMinutes / 60);
totalMinutes %= 60;


  return (
    <div>
      <div className='mx-4'>
        <div className=''>
          <div className='txt px-4 py-4'>
            <h2 className='fs-35 fw-bold'>Dashboard</h2>
          </div>
          <div className='row d-flex'>
            <div className='col-12 col-sm-4 col-md-4 col-lg-4 '>
              <div className='box1 rounded adminborder p-4 m-2'>
                <p className='mb-0'>22-Oct-2023</p>
                <p className='fs-25 fw-bold'>Clock In/Out</p>
                <div className="d-flex">
                {isClockedIn ? (
                    <button className="btn btn-danger text-white" onClick={handleClockOut}>Stop</button>
                    ) : (
                    <button className="btn btn-primary text-white mx-2" onClick={handleClockIn}>Start</button>
                    )}
                </div>

                <div className='pt-3'>
                    <p className='mb-0'>Time</p>
                    <p className='fs-3 fw-bold'>{totalTime}</p>
                </div>
              </div>
            </div>
            <div className='col-12 col-sm-4 col-md-4 col-lg-4'>
              <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2'>
                <div>
                    <p className='mb-0'>Current month</p>
                    <p className='fs-25 fw-bold text-danger'>{currentMonth}</p>
                </div>
                <div className='pt-3'>
                    <p className='mb-0'>Total Time</p>
                    <p className='fs-3 fw-bold'>{totalHours} hrs {totalMinutes} mins {totalSeconds} secs</p>
                    {/* <p className='fs-3 fw-bold'>{totalMonthTime.hours} hrs {totalMonthTime.minutes} mins</p> */}

                </div>
              </div>
            </div>
          </div>

          <div className="row my-3">
            <div className="text">
              <p>This Month</p>
            </div>

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
                    <p>Total Time s</p>
                  </div>
                </div>

              {userEntries.map((entry) => (
            <div className="row" key={entry._id}>
              <div className="col-2">
                <p>{new Date(entry.startTime).toLocaleTimeString()}</p>
              </div>
              <div className="col-2">
                <p>{new Date(entry.endTime).toLocaleTimeString()}</p>
              </div>
              <div className="col-2">
                <p>{new Date(entry.startTime).toLocaleDateString()}</p>
              </div>
              <div className="col-2">
                <p>{new Date(entry.endTime).toLocaleDateString()}</p>
              </div>
              <div className="col-4">
                <p>{entry.totalTime}</p>
                {/* <p>{entry.totalTime.hours} hrs {entry.totalTime.minutes} mins</p> */}
              </div>
            </div>
          ))}
          
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
