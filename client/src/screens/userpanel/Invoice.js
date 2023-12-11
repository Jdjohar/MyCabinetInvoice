import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate,useLocation } from 'react-router-dom';
import Usernav from './Usernav';
// import Nav from './Nav';

export default function Invoice() {
    const [invoices, setinvoices] = useState([]);
    const [selectedinvoices, setselectedinvoices] = useState(null);
    const location = useLocation();
    const invoiceid = location.state?.invoiceid;
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const userid = localStorage.getItem("userid");
            const response = await fetch(`http://localhost:3001/api/invoicedata/${userid}`);
            const json = await response.json();

            if (Array.isArray(json)) {
                setinvoices(json);

                const transactionPromises = json.map(async (invoice) => {
                    const response = await fetch(`http://localhost:3001/api/gettransactiondata/${invoice._id}`);
                    const transactionJson = await response.json();
                    return transactionJson.map(transaction => ({
                        ...transaction,
                        invoiceId: invoice._id // Attach invoiceId to each transaction
                    }));
                });

                const transactionsData = await Promise.all(transactionPromises);
                const flattenedTransactions = transactionsData.flat(); // Flatten the transactions array
                setTransactions(flattenedTransactions);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleViewClick = (invoice) => {
        let invoiceid = invoice._id;
        navigate('/userpanel/Invoicedetail', { state: { invoiceid } });
    };

    const formatCustomDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
      };

    const handleAddClick = () => {
        navigate('/userpanel/Createinvoice');
    }

    const getStatus = (invoice) => {
        // Filter transactions related to the current invoice
        const relatedTransactions = transactions.filter(transaction => transaction.invoiceId === invoice._id);
    
        console.log("relatedTransactions:", relatedTransactions);
        console.log("Transactions:", transactions);
        console.log("Invoices:", invoices);
        // Calculate the total paid amount for the current invoice
        const totalPaidAmount = relatedTransactions.reduce(
            (total, payment) => total + parseFloat(payment.paidamount),
            0
        );

    console.log("totalPaidAmount:", totalPaidAmount);
        if (totalPaidAmount === 0) {
            return (
                <strong>
                    <i class="fa-solid fa-circle fs-12 mx-2 saved"></i> Saved
                </strong>
            )
        } else if (totalPaidAmount > 0 && totalPaidAmount < invoice.total) {
            return (
                <strong>
                    <i class="fa-solid fa-circle fs-12 mx-2 partiallypaid"></i> Partially Paid
                </strong>
            )
        } else if (totalPaidAmount === invoice.total) {
            return (
                <strong>
                    <i class="fa-solid fa-circle fs-12 mx-2 paid"></i> Paid
                </strong>
            )
        } else {
            return "Payment Pending";
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
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Usernav/>
                    </div>
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row py-2'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='h5 fw-bold'>Invoice</p>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Add New</button>
                            </div>
                        </div><hr />

                        <div className="row px-2 table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">INVOICE </th>
                                        <th scope="col">STATUS </th>
                                        <th scope="col">DATE </th>
                                        <th scope="col">View </th>
                                        <th scope="col">AMOUNT </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {invoices.map((invoice, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <p className='my-0 fw-bold clrtrxtstatus'>{invoice.customername}</p>
                                                    <p className='my-0'>{invoice.InvoiceNumber}</p>
                                                </td>
                                                <td>
                                                    <span className='clrtrxtstatus'>{getStatus(invoice)}</span>
                                                </td>
                                                <td>
                                                    <div className='d-flex'>
                                                        <p className='issue px-1 my-1'>Issued</p>
                                                        <p className='datetext my-1'>{formatCustomDate(invoice.date)}</p>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <p className='due px-1'>Due</p>
                                                        <p className='datetext'>{formatCustomDate(invoice.duedate)}</p>
                                                    </div>
                                                </td>
                                                 
                                                <td className='text-center'>
                                                    <a role="button" className='text-black text-center' onClick={ () => handleViewClick(invoice)}>
                                                        <i class="fa-solid fa-eye"></i>
                                                    </a>
                                                </td>
                                                <td>&#8377; {invoice.total}</td>
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