import React,{useState,useEffect} from 'react'
import { format } from 'date-fns';
import {useNavigate} from 'react-router-dom'
import { ColorRing } from  'react-loader-spinner'

export default function Dashboard() {
  const [ loading, setloading ] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 10; // Number of entries to display per page
    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        fetchsignupdata();
        // setloading(true)
        
    }, [])
    let navigate = useNavigate();
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [signupdata, setsignupdata] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [totalTime, setTotalTime] = useState(0);
    const [userEntries, setUserEntries] = useState([]);
    const currentDate = new Date(); // Get the current date
  
    const currentMonth = format(currentDate, 'MMMM');


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
        // Calculate the start and end timestamps for the current month
        const currentMonthIndex = currentDate.getMonth(); // Get the current month (0-indexed)
        const currentYear = currentDate.getFullYear();
        const startOfMonth = new Date(currentYear, currentMonthIndex, 1, 0, 0, 0);
        const endOfMonth = new Date(currentYear, currentMonthIndex + 1, 0, 23, 59, 59);

        fetchUserEntries(startOfMonth, endOfMonth);
    }, [isClockedIn, startTime]);

    const fetchUserEntries = async (start, end) => {
      try {
        const userid = localStorage.getItem('userid');
        const response = await fetch(`http://localhost:3001/api/userEntries/${userid}`);
        const data = await response.json();
        
        // Filter userEntries to include only entries for the current month
        const filteredEntries = data.userEntries.filter((entry) => {
          const entryTime = new Date(entry.startTime).getTime();
          return entryTime >= start.getTime() && entryTime <= end.getTime();
        });
        
        setUserEntries(filteredEntries);
        
        setTimeout(() => {
          setloading(false);
        }, 2000);
      } catch (error) {
        console.error(error);
      }
    };

    const handleAddClick = () => {
      navigate('/userpanel/Createinvoice');
    }

    const fetchsignupdata = async () => {
      try {
          const userid =  localStorage.getItem("userid");
          const response = await fetch(`http://localhost:3001/api/getsignupdata/${userid}`);
          const json = await response.json();
          
          // if (Array.isArray(json)) {
              setsignupdata(json);
          // }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

          

  return (
    <div>
      {
        loading?
        <div className='row'>
          <ColorRing
        // width={200}
        loading={loading}
        // size={500}
        display="flex"
        justify-content= "center"
        align-items="center"
        aria-label="Loading Spinner"
        data-testid="loader"        
      />
        </div>:
      <div className='mx-4'>
        
        <div className=''>
          <div className='txt px-4 py-4'>
            <h2 className='fs-35 fw-bold'>Dashboard</h2>
            <p>Hi, {signupdata.FirstName} ! &#128075;</p>
          </div>
          <div className='row'>
            <div className='col-12 col-sm-12 col-md-8 col-lg-8 '>
              <div className='box1 rounded adminborder p-4 m-2'>
                <p className='fs-6 fw-bold'>CREATE DOCUMENT</p>
                <div className="row">
                    <div className="col-6 ">
                      <div className='px-4 py-4 dashbox pointer' onClick={handleAddClick}>
                        <i class="fa-solid fa-receipt text-primary pe-3 fs-4"></i><span className='fs-6 fw-bold'>Create Invoice</span>
                      </div>
                    </div>
                    <div className="col-6 ">
                      <div className='px-4 py-4 dashbox'>
                        <i class="fa-solid fa-receipt text-primary pe-3 fs-4"></i><span className='fs-6 fw-bold'>Create Estimate</span>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-sm-4 col-md-4 col-lg-4'>
              <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2'>
              </div>
            </div>
          </div>

          <div className="row">
            <div className='col-12 col-sm-4 col-md-4 col-lg-4'>
              <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2 text-center'>
                <p className='fs-6 fw-bold'>TOTAL PAYMENTS RECEIVED</p>
                <p className='fs-3 fw-bold'></p>
              </div>
            </div>
            <div className='col-12 col-sm-4 col-md-4 col-lg-4'>
              <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2 text-center'>
                <p className='fs-6 fw-bold'>OCTOBER INVOICE AMOUNT</p>
                <p className='fs-3 fw-bold'></p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className='col-12 col-sm-8 col-md-8 col-lg-8'>
              <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2'>
                <div className="row">
                  <div className="col-3 greyclr">
                    <p>INVOICE</p>
                  </div>
                  <div className="col-3 greyclr">
                    <p>STATUS</p>
                  </div>
                  <div className="col-3 greyclr">
                    <p>DATE</p>
                  </div>
                  <div className="col-3 greyclr">
                    <p>AMOUNT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
}
    </div>
  )
}
