import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';
// import Nav from './Nav';
import { format } from 'date-fns';


export default function Customerlist() {
    const [customers, setcustomers] = useState([]);
    const [selectedcustomers, setselectedcustomers] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        fetchdata();
    }, [])

    const handleAddClick = () => {
        navigate('/userpanel/Addcustomer');
    }

    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     return format(date, 'dd/MM/yyyy');
    // };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
        
    };

    const fetchdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`https://invoice-n96k.onrender.com/api/customers/${userid}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setcustomers(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleEditClick = (customer) => {
        setselectedcustomers(customer);
        let customerId = customer._id;
        navigate('/userpanel/Editcustomer', { state: { customerId } });
    };

    const handleDeleteClick = async (customerId) => {
        try {
            const response = await fetch(`https://invoice-n96k.onrender.com/api/delcustomers/${customerId}`, {
                method: 'GET'
            });
    
            const json = await response.json();
    
            if (json.Success) {
                fetchdata(); // Refresh the customers list
            } else {
                console.error('Error deleting customer:', json.message);
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <div  >
                    <Usernavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    {/* <div className='d-lg-none d-md-none d-block mt-2'>
                        <Nav/>
                    </div> */}
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row py-2'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='h5 fw-bold'>Customers</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/customerpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Customers</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Create</button>
                            </div>
                        </div><hr />

                        <div className="row px-2 table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">ID </th>
                                        <th scope="col">Customer </th>
                                        <th scope="col">Email </th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Phone Number  </th>
                                        <th scope="col">Edit/Delete </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {customers.map((customer, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{customer.name}</td>
                                                <td>{customer.email}</td>
                                                <td>{formatDate(customer.createdAt)}</td>
                                                <td>{customer.number}</td>
                                                <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={ () => handleEditClick(customer)}>
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </a>
                                                                <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(customer._id)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
