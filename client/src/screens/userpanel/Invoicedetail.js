import React,{useState,useEffect,useRef } from 'react'
import {useNavigate,useLocation} from 'react-router-dom'
import { ColorRing } from  'react-loader-spinner'
import Usernav from './Usernav';
import Usernavbar from './Usernavbar';

export default function Invoicedetail() {
    const [ loading, setloading ] = useState(true);
    const [signupdata, setsignupdata] = useState([]);
    const modalRef = useRef(null);
    const [items, setitems] = useState([]);
    const location = useLocation();
    const [selectedinvoices, setselectedinvoices] = useState(null);
    const [invoiceData, setInvoiceData] = useState({
        customername: '',itemname: '',customeremail: '',InvoiceNumber: '',purchaseorder: '',
        date: '',duedate: '',description: '',itemquantity: '', price: '',discount: '',
        amount: '',tax: '',taxpercentage:'',subtotal: '',total: '',amountdue: '',information: '',
    });
    const [editorData, setEditorData] = useState("<p></p>");
    const [paidamounterror, setpaidamounterror] = useState("");
    const [paiddateerror, setpaiddateerror] = useState("");
    const [methoderror, setmethoderror] = useState("");
    const [exceedpaymenterror, setexceedpaymenterror] = useState("");
    
    const invoiceid = location.state?.invoiceid;
    const [transactionData, setTransactionData] = useState({
        paidamount: '',
        paiddate: '',
        method: '',
        note:''
      });
      const [transactions, setTransactions] = useState([]);
      const [showAlert, setShowAlert] = useState(false);


    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        fetchsignupdata();
        if (invoiceid) {
            fetchinvoicedata();
            fetchtransactiondata();
        }
    }, [invoiceid])
    let navigate = useNavigate();

    const fetchinvoicedata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`https://invoice-n96k.onrender.com/api/getinvoicedata/${invoiceid}`);
            const json = await response.json();
            
            setInvoiceData(json);
            if (Array.isArray(json.items)) {
                setitems(json.items);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchtransactiondata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`https://invoice-n96k.onrender.com/api/gettransactiondata/${invoiceid}`);
            const json = await response.json();

            // Check if the response contains paidamount
            if (Array.isArray(json)) {
      setTransactions(json);
    //   const totalPaidAmount = payments.reduce((total, payment) => total + payment.paidamount, 0);


    } else {
      console.error('Invalid data structure for transactions:', json);
    }
    setloading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchsignupdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`https://invoice-n96k.onrender.com/api/getsignupdata/${userid}`);
            const json = await response.json();
            
            // if (Array.isArray(json)) {
                setsignupdata(json);
            // }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

  const onchange = (event) => {
    setTransactionData({
      ...transactionData,
      [event.target.name]: event.target.value,
    });
  };

  const formatCustomDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const handleAddPayment = async () => {
    // const invoiceid = 'your-invoice-id'; 
    const userid =  localStorage.getItem("userid");
    // Check for errors
  if (transactionData.paidamount === '') {
    setpaidamounterror("Fill detail");
    return; // Exit the function early if there's an error
  } else {
    setpaidamounterror(""); // Clear the error if the field is filled
  }
  
  if (transactionData.paiddate === '') {
    setpaiddateerror("Fill detail");
    return;
  } else {
    setpaiddateerror("");
  }
  
  if (transactionData.method === '') {
    setmethoderror("Fill detail");
    return;
  } else {
    setmethoderror("");
  }
  // Fetch updated transaction data after payment addition
  await fetchtransactiondata();

  // Calculate total paid amount from transactions
  // const totalPaidAmount = transactions.reduce((total, payment) => total + payment.paidamount, 0);
  const totalPaidAmount = transactions.reduce(
    (total, payment) => total + parseFloat(payment.paidamount),
    0
  );
  // Check if the paid amount exceeds the due amount
  const dueAmount = invoiceData.total - totalPaidAmount;
  const paymentAmount = parseFloat(transactionData.paidamount);

  if (paymentAmount > dueAmount) {
    console.error('Payment amount exceeds the due amount.');
    setexceedpaymenterror("Payment amount exceeds the amount.");
    return;
  } else {
    setexceedpaymenterror("");
  }


    try {
      const response = await fetch('https://invoice-n96k.onrender.com/api/addpayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paidamount: transactionData.paidamount,
          paiddate: transactionData.paiddate,
          method: transactionData.method,
          note:transactionData.note,
          userid: userid,
          invoiceid: invoiceid,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          console.log('Payment added successfully!');
          // Fetch updated transaction data after payment addition
        await fetchtransactiondata();

        // Calculate total paid amount from transactions
        const totalPaidAmount = transactions.reduce((total, payment) => total + payment.paidamount, 0);

        // Update amount due by subtracting totalPaidAmount from total invoice amount
        const updatedAmountDue = invoiceData.total - totalPaidAmount;
        setInvoiceData({ ...invoiceData, amountdue: updatedAmountDue });
        // Close the modal after adding payment
        document.getElementById('closebutton').click();
        if (modalRef.current) {
            modalRef.current.hide();
          }
        } else {
          console.error('Failed to add payment.');
        }
      } else {
        console.error('Failed to add payment.');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handlePrintContent = () => {
  const content = document.getElementById('invoiceContent').innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Invoice</title>
        <style>
      //   @media print {
      //    .row {
      //         background-color: #1a4567 !important;
      //         print-color-adjust: exact; 
      //     }
      // }
      
        .print-page{
          width:80%;
          margin:auto
        }
        .adminborder{
        
          
          width:100%;
        }
        .row{
  
          width:100% !important;
          margin:auto;
        }
      .pt-30{
        padding-top:30px;
      }
      .pb-30{
        padding-bottom:30px;
      }
      .pb-90{
        padding-bottom: 66px;
        padding-top: 15px;
        padding-left: 10px;
        margin-top: 20px;
        margin-bottom: 30px;
      }

      .padding-20{
        padding-top:15px;
        padding-bottom:45px;
      }
        .col-6{
          width:50%;
          float:left
        }
        .col-md-6{
          width:50%;
          float:left
        }
        p, h1,h2,h3,h4,h5,h6 {
          margin:0
        }
        .clear{
          clear:both;
        }

        .invoice-contentcol-6{
          width:25% !important;
          float:left
        }

        .invoice-contentcol-2{
          width:25% !important;
          float:left;
        }
        
        .fw-bold{
          font-weight:bold;
        }

        .invoice-contentcol-12{
          width:100%;
        }

        .printcol-8{
          width:50%;
          float:left;
          text-align:right
        }
        // .printcol-2{
        //   width:25%;
        //   text-align:right
        // }
        .invoice-contentcol-8{
          width:50% !important;
          float:left;
          text-align:center;
        }

        .detailbg{
          background-color: #f0f3f4 !important;
        }

        .offset-8{
          width:25%;
        }

        .text-left{
          text-align:left;
        }

        .text-right{
          text-align:right;
        }

        .padding{
          padding:20px
        }

        .flex{
          display: flex;
          justify-content: end;
        }

        .m-right{
          margin-right:100px;
        }


        </style>
      </head>
      <body>
        <div class="print-page">
          ${content}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

const handleEditContent = (invoiceData) => {
    const totalPaidAmount = transactions.reduce((total, payment) => total + payment.paidamount, 0);

    if (totalPaidAmount === 0) {
        // If totalPaidAmount is 0, navigate to /userpanel/Createinvoice page
        setselectedinvoices(invoiceData);
        let invoiceid = invoiceData._id;
        console.log(invoiceid);
        navigate('/userpanel/Editinvoice', { state: { invoiceid } });
    } else {
        // If totalPaidAmount is not 0, show an alert
        setShowAlert(true);
    }
};

// const handleRemove = async (invoiceid) => {
//     try {
//       const response = await fetch(`https://invoice-n96k.onrender.com/api/removeData/${invoiceid}`, {
//         method: 'GET',
//         // Add any required headers or authentication tokens
//       });
  
//       console.log('Response status:', response.status); // Log response status
  
//       if (response.ok) {
//         console.log('Data removed successfully!');
//         navigate('/userpanel/Invoice');
//       } else {
//         console.error('Failed to remove data.');
//         const errorData = await response.json(); // If available, log the error response data
//         console.error('Error response:', errorData);
//       }
//     } catch (error) {
//       console.error('Error removing data:', error); // Log any fetch-related errors
//     }
//   };

const handleRemove = async (invoiceid) => {
    try {
      const response = await fetch(`https://invoice-n96k.onrender.com/api/deldata/${invoiceid}`, {
        method: 'GET'
      });
  
      const json = await response.json();
  
      if (json.success) {
        console.log('Data removed successfully!');
        navigate('/userpanel/Invoice');
      } else {
        console.error('Error deleting Invoice:', json.message);
      }
    } catch (error) {
      console.error('Error deleting Invoice:', error);
    }
  };
  
// const handleRemove = async (invoiceid) => {
//     try {
//       // Delete invoice and associated transactions based on the invoice ID
//       const response = await fetch(`https://invoice-n96k.onrender.com/api/removeInvoiceAndTransactions/${invoiceid}`, {
//         method: 'GET',
//         // Add any required headers or authentication tokens
//       });
  
//       if (response.ok) {
//         console.log('Invoice and transactions deleted successfully!');
//         //         navigate('/userpanel/Invoice');
//         // Redirect or perform any other necessary actions after deletion
//         // ...
//       } else {
//         console.error('Failed to delete invoice and transactions.');
//         const errorData = await response.json(); // If available, log the error response data
//         console.error('Error response:', errorData);
//       }
//     } catch (error) {
//       console.error('Error deleting invoice and transactions:', error);
//     }
//   };
  

const getStatus = () => {
  if (transactions.length === 0) {
    return "Saved";
  }

  const totalPaidAmount = transactions.reduce(
    (total, payment) => total + parseFloat(payment.paidamount),
    0
  );

  if (totalPaidAmount === 0) {
    return "Saved";
  } else if (totalPaidAmount > 0 && totalPaidAmount < invoiceData.total) {
    return "Partially Paid";
  } else if (totalPaidAmount === invoiceData.total) {
    return "Paid";
  } else {
    return "Payment Pending";
  }
};

  return (
    <div className='bg'>
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
                    <div className='mx-3'>
                        <form>
                        <div className='row py-4 px-2 breadcrumbclr'>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='fs-35 fw-bold'>Invoice</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Invoicedetail</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-1 col-md-4 col-sm-4 col-3 text-right">
                                <div className="dropdown">
                                    <button
                                    className="btn dropdown-toggle no-arrow" // Updated class here
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    >
                                    <i className="fa-solid fa-ellipsis ellipse px-3 py-1" ></i>
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    

                                        <li><a className="dropdown-item" onClick={handlePrintContent}>Print</a></li>
                                        <li><a className="dropdown-item" onClick={ () => handleEditContent(invoiceData)}>Edit</a></li>
                                        <li><a className="dropdown-item" onClick={() => handleRemove(invoiceData._id)}>Remove</a></li>
                                    </ul>
                                </div>
                            
                            </div>
                            <div className="col-lg-1">
                                <button className='btn rounded-pill btn-danger text-white fw-bold' type="submit">Save</button>
                            </div>
                        </div>
                        
                        {showAlert && (
                                <>
                                <div className="row">
                                    <div className="col-lg-7 col-sm-5 col-3"></div>
                                    <div className="col-9 col-sm-7 col-lg-5">
                                    <div class="alert alert-warning d-flex" role="alert">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="alertwidth bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                                          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                        </svg>
                                        <div>
                                        You cannot edit a document that has already been partially paid. Please create a new document.
                                        </div>
                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

                                      </div>
                                </div>
                                    </div>
                                
                                </>
                                        
                                    )}
                        
                        <div className="row">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-8" id="invoiceContent">
                                <div className='box1 rounded adminborder mb-5 pb-5'>
                                    <div className='row pt-30 py-5 px-3'>
                                        <div className="col-6">
                                            <p className='h4 fw-bold'>{signupdata.companyname}</p>
                                        </div>    
                                        <div className="col-6">
                                            <div className="row text-end">
                                                <p className='h4 fw-bold'>Invoice</p>
                                                <p className='fw-bold'>{signupdata.address}</p>
                                                <p className='fw-bold'>{signupdata.email}</p>
                                            </div>
                                        </div>   
                                        <div className='clear'></div> 
                                    </div>

                                    <div className='row py-4 pb-90 px-4 mx-0 mb-4 detailbg'>
                                        <div bgcolor="#333" className="col-12 col-lg-6 col-md-6 col-sm-6 customerdetail">
                                            <p className='fw-bold pt-3'>BILL TO</p>
                                            <p className='my-0'>{invoiceData.customername}</p>
                                            <p className='my-0'>{invoiceData.customeremail}</p>
                                        </div>
                                        <div className="col-12 col-lg-6 col-md-6 col-sm-6 text-md-end text-lg-end ">
                                            <div className='row'>
                                              <div className='col-6 fw-bold'>
                                                  <p className='pt-3'>Invoice #</p>
                                                  <p className='my-0'>Date</p>
                                                  <p className='my-0'>Due date</p>
                                              </div>
                                              <div className='col-6'>
                                              <p className='pt-3'>{invoiceData.InvoiceNumber}</p>
                                              <p className='my-0'>{formatCustomDate(invoiceData.date)}</p>
                                              <p className='my-0'>{formatCustomDate(invoiceData.duedate)}</p>

                                              </div>
                                              
                                            </div>
                                            
                                           
                                        </div>
                                        
                                    </div>

                                    {/* <div className=''> */}
                                        <div className="row pb-30 pt-1 fw-bold invoice-content">
                                            <div className="col-lg-5 col-md-5 col-sm-5 col-4 invoice-contentcol-6">
                                                <p>ITEM</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-3 col-4 invoice-contentcol-6">
                                                <p>QUANTITY</p>
                                            </div>
                                            <div className="col-lg-2 col-md-2 col-sm-2 d-sm-block d-md-block d-lg-block d-none invoice-contentcol-6">
                                                <p>PRICE</p>
                                            </div>
                                            <div className="col-lg-2 col-md-2 col-sm-2 col-4 invoice-contentcol-6">
                                                <p>AMOUNT</p>
                                            </div>
                                        </div>
                                        <hr/>

                                        {items.map((item) => (
                                            <div className='row padding-20 invoice-content'  key={item._id}>
                                              <div className='col-lg-5 col-md-6 col-sm-5 col-4 invoice-contentcol-6'>
                                                  <p className='fw-bold my-0'>{item.itemname}</p>
                                                  {/* <p className='my-0 decwidth'>{item.description}</p> */}
                                              </div>
                                              <div className='col-lg-3 col-md-2 col-sm-3 col-3 invoice-contentcol-2'>
                                                  <p>{item.itemquantity}</p>
                                              </div>
                                              <div className='col-lg-2 col-md-2 col-sm-2 d-sm-block d-md-block d-lg-block d-none invoice-contentcol-2'>
                                                  <p>&#8377; {item.price}</p>
                                              </div>
                                              <div className='col-lg-2 col-md-2 col-sm-2 col-5 invoice-contentcol-2'>
                                                  <p> &#8377; {item.amount}</p>
                                              </div>
                                              <div className="col-lg-6 col-md-6 col-sm-2 col-4 invoice-contentcol-12">
                                                <p className='my-0 decwidth'>{item.description}</p>
                                              </div>
                                            </div>
                                        ))}
                                        <hr />

                                          <div className="row padding-20">
                                            <div className="col-lg-7 col-md-7 col-sm-6 col-4 printcol-8">
                                              <p className='d-none'>.</p>
                                            </div>
                                            <div className="col-lg-2 col-md-2 col-sm-3 col-4 invoice-contentcol-2">
                                                <p className='mb-2'>Subtotal</p>
                                                <p className=''>Total</p>
                                            </div>
                                            <div className="col-lg-3 col-md-3 col-sm-3 col-4 invoice-contentcol-2">
                                                <p className='mb-2'>&#8377; {invoiceData.subtotal}</p>
                                                <p className=''>&#8377; {invoiceData.total}</p>
                                            </div>
                                          </div><hr />
                                            {transactions.map((transaction) => (
                                            <div className='row padding-20'  key={transaction._id}>
                                            
                                                <div className="col-lg-6 col-sm-6 col-md-6  col-2 invoice-contentcol-2">.</div>
                                                <div className="col-lg-3 col-sm-3 col-md-3 col-6 invoice-contentcol-8">
                                                    <p className='mb-2'>Paid on {formatCustomDate(transaction.paiddate)}</p>
                                                </div>
                                                <div className="col-lg-3 col-sm-3 col-md-3 col-4 invoice-contentcol-2">
                                                    <p>&#8377; {transaction.paidamount}</p>
                                                </div>
                                            </div>
                                            ))}
                                            <div className='row'>
                                              <div className=''>
                                                <p></p>
                                              </div>
                                            </div>
                                            <div className="row flex">
                                              <div className="col-lg-4 col-sm-4 col-md-4 col-6 offset-6 offset-lg-7 offset-md-7 offset-sm-7 m-right">
                                                  <div className="mt-2 detailbg p-2 padding">
                                                      <p className='text-left'>Amount Due</p>
                                                      <p className='fs-5 text-end text-right'>
                                                        {console.log(invoiceData.amountdue, "Due Amount")}
                                                        {console.log(transactions.reduce((total, payment) => total + payment.paidamount, 0), "transactions")}
                                                          &#8377; {invoiceData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0)}
                                                      </p>
                                                  </div>
                                              </div>
                                            </div>
                                    {/* </div> */}
                                </div>
                            </div>

                            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
                                <div className='box1 rounded adminborder px-4 py-5'>
                                    <div className="row">
                                            <div className="col-6">
                                                <p>Total</p>
                                                <p>Paid</p>
                                            </div>
                                            <div className="col-6 text-end">
                                                <p>&#8377; {invoiceData.total}</p>
                                                {console.log(transactions)}
                                                
                                                
                                                <p>&#8377; {transactions.reduce((total, payment) => total + payment.paidamount, 0)}</p>
                                               
                                            </div>

                                            {/* <!-- Button trigger modal --> */}
                                            <a className='greenclr pointer mb-3' data-bs-toggle="modal" data-bs-target="#exampleModal1">
                                             View Transactions 
                                            </a>
                                            <a className='greenclr pointer' data-bs-toggle="modal" data-bs-target="#exampleModal">
                                             Mark paid 
                                            </a>

                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        

                        </form>
                    </div>
                </div>
            </div>
        </div>
}

{/* payment modal  */}
<form action="">
  <div class="modal fade" id="exampleModal" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Mark paid</h1>
          <button type="button" class="btn-close" id="closebutton" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="amount" class="form-label">Amount<span class="text-danger">*</span></label>
            <input type="number" class="form-control" name='paidamount' onChange={onchange} id="exampleFormControlInput1" placeholder="Amount" required/>
            {paidamounterror && <p className="text-danger">{paidamounterror}</p>}
            {exceedpaymenterror && <p className="text-danger">{exceedpaymenterror}</p>}
          </div>
          <div class="mb-3">
            <label for="date" class="form-label">Date<span class="text-danger">*</span></label>
            <input type="date" class="form-control" name='paiddate' onChange={onchange} id="exampleFormControlInput2" placeholder="Date" required/>
            {paiddateerror && <p className="text-danger">{paiddateerror}</p>}
          </div>
          <div class="mb-3">
            <label for="date" class="form-label">Method<span class="text-danger">*</span></label>
            <select class="form-select" name='method' onChange={onchange} aria-label="Default select example" required>
              <option selected disabled hidden>Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit">Credit</option>
              <option value="Cheque">Cheque</option>
              <option value="Transfer">Transfer</option>
            </select>
            {methoderror && <p className="text-danger">{methoderror}</p>}
          </div>
          <div class="mb-3">
            <label for="note" class="form-label">Note</label>
            <input type="text" class="form-control" name='note' onChange={onchange} id="exampleFormControlInput4" placeholder="Note"/>
          </div>
        </div>
        <div class="modal-footer">
          <a data-bs-dismiss="modal" className='pointer text-decoration-none text-dark'>Close</a>
          <a className='greenclr ms-2 text-decoration-none pointer' onClick={handleAddPayment}>Add Payment</a>
        </div>
      </div>
    </div>
  </div>
</form>


{/* transaction modal  */}

<div class="modal fade" id="exampleModal1" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">View Transactions</h1>
        <button type="button" class="btn-close" id="closebutton" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div className="row px-2 text-center">
            <div className="col-4">
                <p>DATE</p>
            </div>
            <div className="col-4">
                <p>NOTE</p>
            </div>
            <div className="col-4">
                <p>AMOUNT</p>
            </div>
        </div><hr />
        {transactions.map((transaction) => (
            <>
            <div className='row px-2  text-center'  key={transaction._id}>
                <div className="col-4">
                    <p className='mb-0'> {formatCustomDate(transaction.paiddate)}</p>
                </div>
                <div className="col-4">
                    <p className='mb-0'>{transaction.note}</p>
                </div>
                <div className="col-4">
                    <p className='mb-0'>&#8377; {transaction.paidamount}</p>
                </div>
            </div><hr />
            </>
            ))}
      </div>
      <div class="modal-footer">
        <a data-bs-dismiss="modal" className='pointer text-decoration-none text-dark'>Close</a>
      </div>
    </div>
  </div>

</div>
    </div>
  )
}
