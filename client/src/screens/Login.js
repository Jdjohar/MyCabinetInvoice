import React,{useState,useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import jwt_decode from "jwt-decode";
import './Login.css'

export default function Login() {
  const [credentials, setCredentials] = useState({email:"", password:""})
  const [message, setmessage] = useState(false);
  const [alertShow, setAlertShow] = useState("");

  let navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();

    const response = await fetch("https://invoice-n96k.onrender.com/api/login",{
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({email:credentials.email,password:credentials.password})
    });

    const json = await response.json();

    console.log(json, 'sd');

    if(!json.Success){
        // alert('Enter vaild  Credentails');
        setmessage(true);
        setAlertShow(json.errors)

    }
    if(json.Success){
      localStorage.setItem("authToken", json.authToken)
      localStorage.setItem("userid", json.userid)
      localStorage.setItem("username", json.username)
      localStorage.setItem("userEmail", credentials.email)
      localStorage.setItem("isTeamMember", json.isTeamMember)
      localStorage.setItem("startTime", json.startTime)
      console.log(localStorage.getItem("authToken"), "Data")
        // navigate("/userpanel/Userdashboard");
        if (json.isTeamMember == true) {
          // Redirect to the team member dashboard
          navigate('/Teammemberpanel/Teammenberdashboard');
        } else if (json.isTeamMember == false){
          // Redirect to the user dashboard
          navigate('/userpanel/Userdashboard');
        }
    }
    else{
      alert("Login with correct details")
    }
}

const onchange = (event) => {
  setCredentials({...credentials, [event.target.name]:event.target.value})
}

  return (
    <div className='py-3'>
        <h1 className='text-center my-5 fw-bold'>IN<span className='clrblue'>VOICE</span></h1>
      <section className='d-flex justify-content-center align-items-center'>
        
        <form class="signin-form loginbox" onSubmit={handleSubmit}>
            <div className=' p-5 pb-4 mt-3'>
                <p className='h4 fw-bold'>Sign In</p>

                <div class="form-group mb-3 pt-3">
                    <label class="label" for="name">Email</label>
                    <input type="text" class="form-control" name="email" value={credentials.email}  onChange={onchange} placeholder="Email" required />
                </div>
                <div class="form-group mb-3">
                    <label class="label" for="password">Password</label>
                    <input type="password" class="form-control" name="password" value={credentials.password}  onChange={onchange} placeholder="Password" required />
                </div>
                <div class="form-group d-flex justify-content-center">
                    <button type="submit" class="form-control w-75 btn btnblur text-white mb-1">Sign In</button>
                </div>
            </div>
            <div class="form-group mb-3">
                <div class=" text-center">
                    <p class="checkbox-wrap checkbox-primary mb-0 fw-bold">Don't have an account?
                    <Link className="text-dark" aria-current="page" to="/signup">Sign up</Link>
                    </p>
                    <p className='fw-bold'>Forgot Password?</p>
                </div>
            </div>
        </form>
      </section>
    </div>
  )
}
