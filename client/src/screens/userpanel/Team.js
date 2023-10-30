import React, { useState, useEffect }  from 'react'
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';

export default function Team() {

    const [teammembers, setTeammembers] = useState([]);
    const [selectedteammembers, setselectedteammembers] = useState(null);
    
    const navigate = useNavigate();

    const handleAddClick = () => {
        navigate('/Addteam');
    }

    useEffect(() => {
        fetchdata();
    }, []);

    const fetchdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`https://invoice-n96k.onrender.com/api/teammemberdata/${userid}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setTeammembers(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

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
                                <p className='h5 fw-bold'>Team</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Team</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Add New</button>
                            </div>
                        </div><hr />

                        <div className="row px-2 table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">ID </th>
                                        <th scope="col"> Name </th>
                                        <th scope="col">Email </th>
                                        <th scope="col">Phone Number  </th>
                                        {/* <th scope="col">Menu </th> */}
                                        {/* <th scope="col">Edit/Delete </th> */}
                                        <th scope="col">Created At </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {teammembers.map((team, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{team.name}</td>
                                                <td>{team.email}</td>
                                                <td>{team.number}</td> 
                                                {/* <td className='text-center'>
                                                    <a role="button" className='text-black text-center' onClick={ () => handleMenuViewClick(restaurant)}>
                                                        <i class="fa-solid fa-eye"></i>
                                                    </a>
                                                </td> */}
                                                {/* <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={ () => handleEditClick(restaurant)}>
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </a>
                                                                <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(restaurant._id)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                    </div>
                                                </td> */}
                                                <td>{team.createdAt}</td>
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
