import React, { useState,useEffect } from 'react'
import Usernavbar from './Usernavbar';
import Usernav from './Usernav';
import {useNavigate} from 'react-router-dom'

export default function Editprofile() {
    
    const [signupdata, setsignupdata] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        fetchsignupdata();
    },[])

    const fetchsignupdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`https://mycabinet.onrender.com/api/getsignupdata/${userid}`);
            const json = await response.json();
            
            // if (Array.isArray(json)) {
                setsignupdata(json);
            // }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        if (files) {
            setImageFile(files[0]);
        } else {
            setsignupdata({ ...signupdata, [name]: value });
        }
    };

    const handleSaveClick = async () => {
        try {
            const userid = localStorage.getItem("userid");
            const formData = new FormData();
            formData.append("companyImageUrl", imageFile);
            Object.entries(signupdata).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await fetch(`https://mycabinet.onrender.com/api/updatesignupdatadata/${userid}`, {
                method: 'POST',
                body: formData,
            });

            const json = await response.json();

            if (json.Success) {
                navigate('/userpanel/Customerlist');
            } else {
                console.error('Error updating Signupdata:', json.message);
            }
        } catch (error) {
            console.error('Error updating Signupdata:', error);
        }
    };

    // const handleSaveClick = async () => {
    //     try {
    //         const userid =  localStorage.getItem("userid");
    //         const updatedsignupdata = {
    //             ...signupdata
    //         };
    //         const response = await fetch(`https://mycabinet.onrender.com/api/updatesignupdatadata/${userid}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(updatedsignupdata)
    //         });

    //         const json = await response.json();

    //         if (json.Success) {
    //             navigate('/userpanel/Customerlist');
    //             console.log(updatedsignupdata);
    //         } else {
    //             console.error('Error updating Signupdata:', json.message);
    //         }
    //     } catch (error) {
    //         console.error('Error updating Signupdata:', error);
    //     }
    // };


  return (
    <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <div  >
                    <Usernavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Usernav/>
                    </div>
                    <div className='mx-4 my-5'>
                        <section className='box1 rounded adminborder p-4 m-2 mb-5'>
                            <form>
                                <div className=' p-5 pb-4 mt-3'>
                                    <p className='h4 fw-bold'>Edit Profile</p>

                                    <div className="row">
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="company_image">Choose Company Image</label><br />
                                                <input type="file" name="companyImageUrl" onChange={handleInputChange} /> 
                                                <img src={`https://mycabinet.onrender.com/${signupdata.companyImageUrl}`} className='w-25'  alt=""  />
                                           </div>
                                        </div>

                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="company_name">Company name</label>
                                                <input type="text" class="form-control" name="companyname" value={signupdata.companyname} onChange={handleInputChange} placeholder="Company name" />
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="form-group pt-3">
                                                <label htmlFor="exampleInputtext2" className="form-label py-1">Business Type</label>
                                                <select
                                                className="form-select"
                                                name="Businesstype"
                                                value={signupdata.Businesstype}
                                                onChange={handleInputChange}
                                                aria-label="Default select example"
                                                >
                                                    <option value="">Select Business Type</option>
                                                    <option value="Art, Photography & Creative Services">Art, Photography & Creative Services</option>
                                                    <option value="Construction & Trades">Construction & Trades</option>
                                                    <option value="Cleaning & Property Maintenance">Cleaning & Property Maintenance</option>
                                                    <option value="Consulting & Professional Services">Consulting & Professional Services</option>
                                                    <option value="Hair, Spa & Beauty">Hair, Spa & Beauty</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="form-group pt-3">
                                                <label htmlFor="exampleInputtext3" className="form-label py-1">Currency Type</label>
                                                <select
                                                className="form-select"
                                                name="CurrencyType"
                                                value={signupdata.CurrencyType}
                                                onChange={handleInputChange}
                                                aria-label="Default select example"
                                                
                                                >
                                                    <option value="">Select Currency Type</option>
                                                    <option value="AUD"> AUD - Australian Dollar </option>
                                                    <option value="CAD"> CAD - Canadian Dollar </option>
                                                    <option value="INR"> INR - Indian Rupee </option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="First_Name">First Name</label>
                                                <input type="text" class="form-control" name="FirstName" value={signupdata.FirstName} onChange={handleInputChange} placeholder="First Name" />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="Last_Name">Last Name</label>
                                                <input type="text" class="form-control" name="LastName" value={signupdata.LastName} onChange={handleInputChange} placeholder="Last Name"  />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div class="form-group mb-3 pt-3">
                                                <label class="label py-2" for="email">Email</label>
                                                <input type="text" class="form-control" name="email" value={signupdata.email} onChange={handleInputChange} placeholder="Email"  />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="form-group mb-3 pt-3">
                                                <label htmlFor="address" className="form-label">Address</label>
                                                <textarea type="message" className="form-control" name="address" value={signupdata.address} onChange={handleInputChange} placeholder="Address" id="exampleInputaddress" />
                                            </div>
                                        </div>
                                    </div>
                                <button type="button" className='btn btnclr text-white me-2' onClick={handleSaveClick}>Save</button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </div>
  )
}
