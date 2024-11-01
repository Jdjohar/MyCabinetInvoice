import React,{useState,useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { ColorRing } from  'react-loader-spinner'
// import jwt_decode from "jwt-decode";
import './Login.css'

export default function Login() {
  const [credentials, setCredentials] = useState({email:"", password:""})
  const [message, setmessage] = useState(false);
  const [loginbtnloader, setloginbtnloader] = useState(false);
  const [alertShow, setAlertShow] = useState("");

  let navigate = useNavigate();

  useEffect(()=> {
    if(!localStorage.getItem('authToken') || localStorage.getItem('authToken') == "" || localStorage.getItem('authToken') == "1"){
      
    }else{
      navigate("/userpanel/Userdashboard");
    }
  })


const handleSubmit = async (e) => {
  e.preventDefault();
  setloginbtnloader(true);

  try {
    const sanitizedEmail = credentials.email.toLowerCase().replace(/\s+/g, '');
    const response = await fetch("https://mycabinet.onrender.com/api/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: sanitizedEmail, password: credentials.password })
    });

    const json = await response.json();

    if (!json.Success) {
      setmessage(true);
      setAlertShow("Login failed. Please try again.");
      // alert("Login failed. Please try again.");
      setloginbtnloader(false);
    } else {
      localStorage.setItem("authToken", json.authToken);
      localStorage.setItem("userid", json.userid);
      localStorage.setItem("username", json.username);
      localStorage.setItem("userEmail", credentials.email);
      localStorage.setItem("isTeamMember", json.isTeamMember);
      localStorage.setItem("startTime", json.startTime);
      localStorage.setItem("currencyType", json.CurrencyType);
      console.log("taxOptions", `[{"id":"${json.TaxName}!${json.taxPercentage}","name":"${json.TaxName}","percentage":${json.taxPercentage}}]`);
      localStorage.setItem("taxOptions", `[{"id":"${json.TaxName}!${json.taxPercentage}","name":"${json.TaxName}","percentage":${json.taxPercentage}}]`);

      if (json.isTeamMember) {
        navigate('/Teammemberpanel/Teammenberdashboard');
      } else {
        navigate('/userpanel/Userdashboard');
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login with correct details")
    alert("Login failed. Please try again.");
    setloginbtnloader(false);
  }
};

const handleForgetPassword = () => {
  navigate('/ForgotPassword');
}

const onchange = (event) => {
  setCredentials({...credentials, [event.target.name]:event.target.value})
}

  return (
    <div className='py-3'>
        <h1 className='text-center my-5 fw-bold'>IN<span className='clrblue'>VOICE</span></h1>
      <section className='d-flex justify-content-center align-items-center'>
        
        <form className="signin-form loginbox" onSubmit={handleSubmit}>
            <div className=' p-5 pb-4 mt-3'>
                <p className='h4 fw-bold'>Sign In</p>

                <div className="form-group text-start mb-3 pt-3">
                    <label className="label text-start" for="name">Email</label>
                    <input type="text" className="form-control" name="email" value={credentials.email}  onChange={onchange} placeholder="Email" required />
                </div>
                <div className="form-group text-start mb-3">
                    <label className="label" for="password">Password</label>
                    <input type="password" className="form-control" name="password" value={credentials.password}  onChange={onchange} placeholder="Password" required />
                </div>
                <div className="form-group d-flex justify-content-center">
                    {
        loginbtnloader?
        <button className="form-control w-75 btn btnblur text-white mb-1">
          <ColorRing
        // width={200}
        loading={loginbtnloader}
        height={30}
        display="flex"
        padding-bottom= "12px"
        justify-content= "center"
        align-items="center"
        aria-label="Loading Spinner"
        data-testid="loader"        
      /></button>
        :<button type="submit" className="form-control w-75 btn btnblur text-white mb-1">Sign In</button>}
                </div>
            </div>

            {alertShow && (
              <>
                <p className='text-danger text-center fw-bold'>Login with correct details.</p>             
              </>                      
              )}
            <div className="form-group mb-3">
                <div className=" text-center">
                    <p className="checkbox-wrap checkbox-primary mb-0 fw-bold">Don't have an account?
                    <Link className="text-dark" aria-current="page" to="/signup">Sign up</Link>
                    </p>
                    <p className='fw-bold pointer' onClick={handleForgetPassword}>Forgot Password?</p>
                </div>
            </div>
        </form>
      </section>
    </div>
  )
}
