import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';
// import Usernavbar from './Usernavbar';
import { CountrySelect, StateSelect, CitySelect } from '@davzon/react-country-state-city';
import "@davzon/react-country-state-city/dist/react-country-state-city.css";
import Usernav from './Usernav';

export default function Addcustomer() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    number: '',
    citydata: '',
    statedata: '',
    countrydata: '',
    information: '',
    address1: '',
    address2: '',
    post: '',
  });

  const [countryid, setcountryid] = useState(false);
  const [stateid, setstateid] = useState(false);
  const [cityid, setcityid] = useState(false);

  const [country, setcountry] = useState(false);
  const [state, setstate] = useState(false);
  const [city, setcity] = useState(false);

  const [message, setMessage] = useState(false);
  const [alertShow, setAlertShow] = useState('');

  useEffect(() => {
    if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
    {
      navigate("/");
    }
})

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userid = localStorage.getItem('userid');
    const response = await fetch('http://localhost:3001/api/addcustomer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userid,
        name: credentials.name,
        email: credentials.email,
        information: credentials.information,
        number: credentials.number,
        city: city,
        state: state,
        country: country,
        citydata: credentials.citydata,
        statedata: credentials.statedata,
        countrydata: credentials.countrydata,
        cityid: cityid,
        stateid: stateid,
        countryid: countryid,
        address1: credentials.address1,
        address2: credentials.address2,
        post: credentials.post,
      }),
    });

    const json = await response.json();
    console.log(json);

    if (json.Success) {
      setCredentials({
        name: '',
        email: '',
        number: '',
        citydata: '',
        statedata: '',
        countrydata: '',
        information: '',
        address1: '',
        address2: '',
        post: '',
      });

      setMessage(true);
      setAlertShow(json.message);
      navigate('/userpanel/Customerlist');
    }

    else{
        alert("This Customer Email already exist")
    }
  };

  const onchange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };


  return (
    <div className="bg">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none">
            <div>
              <Usernavbar />
            </div>
          </div>

          <div className="col-lg-10 col-md-9 col-12 mx-auto">
            <div className="d-lg-none d-md-none d-block mt-2">
              <Usernav/>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="bg-white my-5 p-4 box mx-4">
                <div className="row">
                  <p className="h5 fw-bold">Customer</p>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/userpanel/Userdashboard" className="txtclr text-decoration-none">
                          Dashboard
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Add a new Customer
                      </li>
                    </ol>
                  </nav>
                </div>
                <hr />
                <div className="row">
                  <div className="">
                  {/* <div className="col-11 m-auto box shadow"> */}
                    <div className="p-3">
                      {/* <p className="h5">Customer details</p> */}
                      {/* <hr /> */}
                      <div className="row">
                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="exampleInputtext1" className="form-label">
                            Customer Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={credentials.name}
                              onChange={onchange}
                              placeholder="Customer Name"
                              id="exampleInputtext1"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                              Contact Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              value={credentials.email}
                              onChange={onchange}
                              placeholder="Contact Email"
                              id="email"
                              aria-describedby="emailHelp"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="Number" className="form-label">
                              Phone Number
                            </label>
                            <input
                              type="number"
                              name="number"
                              className="form-control"
                              onChange={onchange}
                              placeholder="Phone Number"
                              id="phonenumber"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-12 col-lg-12">
                          <div className="mb-3">
                            <label htmlFor="information" className="form-label">
                            Additional Information
                            </label>
                            <textarea
                              type="text"
                              className="form-control"
                              name="information"
                              onChange={onchange}
                              placeholder="Information"
                              id="information"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="Address1" className="form-label">
                              Address 1
                            </label>
                            <input
                              type="message"
                              name="address1"
                              onChange={onchange}
                              className="form-control"
                              placeholder="Address 1"
                              id="Address1"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="Address2" className="form-label">
                              Address 2
                            </label>
                            <input
                              type="message"
                              name="address2"
                              onChange={onchange}
                              className="form-control"
                              placeholder="Address 2"
                              id="Address2"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="Country" className="form-label">
                              Country
                            </label>
                            <CountrySelect
                              name="country"
                              value={credentials.countryid}
                              onChange={(val) => {
                                console.log(val);
                                setcountryid(val.id);
                                setcountry(val.name);
                                    // setCredentials({ ...credentials, country: val.name })
                                    // setCredentials({ ...credentials, countryid: val.id })
                                    setCredentials({ ...credentials, countrydata: JSON.stringify(val) })
                                  
                              }}
                              valueType="short"
                              class="form-control" 
                              placeHolder="Select Country"
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="State" className="form-label">
                              State
                            </label>
                            <StateSelect
                                name="state"
                                countryid={countryid} // Set the country selected in the CountryDropdown
                                onChange={(val) => {
                                    console.log(val);
                                    setstateid(val.id);
                                    setstate(val.name);
                                    // setCredentials({ ...credentials, state: val.name })
                                    // setCredentials({ ...credentials, stateid: val.id })
                                    setCredentials({ ...credentials, statedata: JSON.stringify(val) })
                                }}
                                placeHolder="Select State"
                                />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="City" className="form-label">
                              City
                            </label>
                            <CitySelect
                                countryid={countryid}
                                stateid={stateid}
                                onChange={(val) => {
                                console.log(val);
                                setcityid(val.id);
                                setcity(val.name);
                                // setCredentials({ ...credentials, city: val.name })
                                // setCredentials({ ...credentials, cityid: val.id })
                                setCredentials({ ...credentials, citydata: JSON.stringify(val) })
                                }}
                                placeHolder="Select City"
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="post" className="form-label">
                            Post
                            </label>
                            <input
                              type="text"
                              name="post"
                              onChange={onchange}
                              className="form-control"
                              placeholder="post"
                              id="post"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row pt-4 pe-2">
                  <div className="col-3 me-auto"></div>
                  <div className="col-4 col-sm-2">
                    <button className="btn btnclr text-white">Next</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}