import React,{useState,useEffect,useRef } from 'react'
import {useNavigate,useLocation} from 'react-router-dom'
import { ColorRing } from  'react-loader-spinner'
import Usernav from './Usernav';
import Usernavbar from './Usernavbar';
// import 'react-multi-email/style.css';
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css'
import html2pdf from 'html2pdf.js';
import CurrencySign from '../../components/CurrencySign ';
import { PDFViewer,pdf, PDFDownloadLink, Document,Image, Page, Text, Font, View, StyleSheet } from '@react-pdf/renderer';

export default function Invoicedetail() {
    const [ loading, setloading ] = useState(true);
    const [signupdata, setsignupdata] = useState([]);
    const [showSendEmailModal, setShowSendEmailModal] = useState(false);
    const modalRef = useRef(null);
    const modalRefemail = useRef(null);
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
    const [duedepositDate, setDueDepositDate] = useState('')
    const [savedDepositData, setsavedDepositData] = useState('')
    const [transactionData, setTransactionData] = useState({
        paidamount: '',
        paiddate: '',
        method: '',
        note:''
      });
      const [transactions, setTransactions] = useState([]);
      const [showAlert, setShowAlert] = useState(false);
      const [emails, setEmails] = useState([]);
      const [bccEmails, setBccEmails] = useState([]);
      const [content, setContent] = useState('Thank you for your business.');
      const [showModal, setShowModal] = useState(false);
      const [showEmailAlert, setShowEmailAlert] = useState(false);
      const [depositpercentage, setdepositPercentage] = useState('');
      const [amount, setAmount] = useState('');
      const [pdfExportVisible, setPdfExportVisible] = useState(false);
      const styles = StyleSheet.create({
        page: {
          flexDirection: 'row',
          backgroundColor: '#E4E4E4'
        },
        section: {
          margin: 10,
          padding: 10,
          flexGrow: 1
        },
        header: {
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between'
        },
        bgheader: {
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: "#f7f7f7"
        },
        fsize:{
          fontSize:"14px"
        },
        bgbottom: {
          marginBottom: 10,
          borderBottom:"1px solid #00000014"
        },
        invoiceHeader: {
          fontSize: 14,
          fontWeight: 'bold'
        },
        companyInfo: {
          width: '50%'
        },
        customerInfo: {
          width: '50%',
          textAlign: 'right'
        },
        Info: {
          width: '25%',
          textAlign: 'right'
        },
        Info1: {
          width: '30%',
        },
        div40: {
          width: '40%',
        },
        div20: {
          width: '20%',
        },
        itemRow: {
          flexDirection: 'row',
          justifyContent: 'space-between'
        },
        itemCell: {
          width: '25%'
        },
        totalRow: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
        },
        totalCell: {
          width: '25%',
          textAlign: 'right'
        },
        bgcolor: {
          width: '40%',
          padding:20,
          backgroundColor: "#f7f7f7"
        }
      });


    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        fetchsignupdata();
        if (invoiceid) {
            fetchinvoicedata();
            fetchdepositdata();
            fetchtransactiondata();
        }
    }, [invoiceid])

    useEffect(() => {
      console.log('Customer Email:', invoiceData.customeremail);
      if (invoiceData.customeremail) {
        setEmails([invoiceData.customeremail]);
      }
    }, [invoiceData.customeremail]);

    // useEffect(() => {
    //   const storedAmount = localStorage.getItem('amount');
    //   if (storedAmount) {
    //     setAmount(storedAmount);
    //   }
    // }, []);
  
    // useEffect(() => {
    //   localStorage.setItem('amount', amount);
    // }, [amount]);

    let navigate = useNavigate();

    const roundOff = (amount) => {
      return parseFloat(amount).toFixed(2);
    };

    const handlePercentageChange = (event) => {
      setdepositPercentage(event.target.value);
      calculateAmount(event.target.value);
    };
  
    const calculateAmount = (depositpercentage) => {
      let totalAmount = invoiceData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0);
      let calculatedAmount = (totalAmount * depositpercentage) / 100;
      setAmount(calculatedAmount.toFixed(2));
    };

    
    const handleDateChange = (event) => {
      setDueDepositDate(event.target.value);
    };

    const handleMarkDeposit = async () => {
            const userid =  localStorage.getItem("userid");
      // Add logic to save the deposit in the database
    const depositAmount = parseFloat(savedDepositData.depositamount);
    if (depositAmount > 0) {
      const totalPaidAmount = transactions.reduce((total, payment) => total + payment.paidamount, 0);
      const newPaidAmount = totalPaidAmount + depositAmount;

      // Add the deposit transaction to the transactions array
      const newTransaction = {
        paidamount: newPaidAmount,
        paiddate: new Date().toISOString(), // Assuming current date as the paid date
        method: 'Deposit', // Assuming the deposit is made directly to the system
        note: 'Deposit', // Note for the deposit transaction
      };

      try {
        const response = await fetch('https://invoice-n96k.onrender.com/api/addpayment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paidamount: depositAmount,
            paiddate: new Date().toISOString(),
            method: "deposit",
            note:"Deposit",
            userid: userid,
            invoiceid: invoiceid,
            depositid: savedDepositData._id,
          }),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success) {
            setsavedDepositData('');
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

      // Update the trans actions array with the new transaction
      // const updatedTransactions = [...transactions, newTransaction];

      // Update the transactions in the database with the new transaction
      // Add your logic here to update the transactions in the database

      // Update the state with the new transactions
      // setTransactions(updatedTransactions);

      // Close the modal
      setShowModal(false);
    }
    };
    
    const handleSave = async () => {
      const userid = localStorage.getItem("userid");
      
      try {
        if ((savedDepositData != null || savedDepositData != "") && savedDepositData._id != undefined) {
          // If savedDepositData exists and has an ID, update the existing record
          const response = await fetch(`https://invoice-n96k.onrender.com/api/updatedeposit/${savedDepositData._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "depositamount": amount, 
              "duedepositdate": duedepositDate,
              "depositpercentage": depositpercentage,
              "method": 'Pending',
              "userid": userid,
              "invoiceid": invoiceid, 
            }),
          });
      
          const data = await response.json();
      
          if (data.Success) {
            console.log('Deposit updated successfully:', data.deposit);
            const savedDepositResponse = await fetch(`https://invoice-n96k.onrender.com/api/deposit/${data.deposit._id}`);
            const savedDepositDatad = await savedDepositResponse.json();
            setsavedDepositData(savedDepositDatad.deposit);
            // You may update the state here if required
          } else {
            console.error('Failed to update deposit:', data.error);
          }
        } else {
          // If savedDepositData is empty or does not have an ID, add a new record
          const response = await fetch('https://invoice-n96k.onrender.com/api/deposit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "depositamount": amount, 
              "duedepositdate": duedepositDate,
              "depositpercentage": depositpercentage,
              "method": 'Pending',
              "userid": userid,
              "invoiceid": invoiceid, 
            }),
          });
      
          const data = await response.json();
      
          if (data.success) {
            const savedDepositResponse = await fetch(`https://invoice-n96k.onrender.com/api/deposit/${data.deposit._id}`);
            const savedDepositDatad = await savedDepositResponse.json();
            setsavedDepositData(savedDepositDatad.deposit);
            console.log('New deposit added successfully:', data.deposit);
            // You may update the state here if required
          } else {
            console.error('Failed to add new deposit:', data.error);
          }
        }
      } catch (error) {
        console.error('Error saving deposit:', error);
      }
    };

    const handleSaveAndSend = async () => {
      const userid = localStorage.getItem("userid");
      
      try {
        if ((savedDepositData != null || savedDepositData != "") && savedDepositData._id != undefined) {
          // If savedDepositData exists and has an ID, update the existing record
          const response = await fetch(`https://invoice-n96k.onrender.com/api/updatedeposit/${savedDepositData._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "depositamount": amount, 
              "duedepositdate": duedepositDate,
              "depositpercentage": depositpercentage,
              "method": 'Pending',
              "userid": userid,
              "invoiceid": invoiceid, 
            }),
          });
      
          const data = await response.json();
      
          if (data.Success) {
            console.log('Deposit updated successfully:', data.deposit);
            const savedDepositResponse = await fetch(`https://invoice-n96k.onrender.com/api/deposit/${data.deposit._id}`);
            const savedDepositDatad = await savedDepositResponse.json();
            setsavedDepositData(savedDepositDatad.deposit);
            setShowSendEmailModal(true);
            // You may update the state here if required
          } else {
            console.error('Failed to update deposit:', data.error);
          }
        } else {
          // If savedDepositData is empty or does not have an ID, add a new record
          const response = await fetch('https://invoice-n96k.onrender.com/api/deposit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "depositamount": amount, 
              "duedepositdate": duedepositDate,
              "depositpercentage": depositpercentage,
              "method": 'Pending',
              "userid": userid,
              "invoiceid": invoiceid, 
            }),
          });
      
          const data = await response.json();
      
          if (data.success) {
            const savedDepositResponse = await fetch(`https://invoice-n96k.onrender.com/api/deposit/${data.deposit._id}`);
            const savedDepositDatad = await savedDepositResponse.json();
            setsavedDepositData(savedDepositDatad.deposit);
            console.log('New deposit added successfully:', data.deposit);
            setShowSendEmailModal(true);
      //       You may update the state here if required
          } else {
            console.error('Failed to add new deposit:', data.error);
          }
        }
      } catch (error) {
        console.error('Error saving deposit:', error);
      }
    };

    const handleEditModal = () => {

      const getEditData = savedDepositData;
      console.log(getEditData,"getEditData");
      setShowModal(true);
      setdepositPercentage(getEditData.depositpercentage)
      setAmount(getEditData.depositamount)
      setDueDepositDate(getEditData.duedepositdate)
    };
  

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

    const fetchdepositdata = async () => {
        try {
          const userid =  localStorage.getItem("userid");
            const response = await fetch(`https://invoice-n96k.onrender.com/api/getdepositdata/${userid}/${invoiceid}`);
            const json = await response.json();
            
            setsavedDepositData(json);
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
                console.log(signupdata);
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
        
        /* Adjustments for better PDF rendering */
        body {
          font-size: 14px;
        }
        .invoice-content {
          page-break-inside: avoid;
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

  // Function to handle changes in email input
  const handleEmailChange = (newEmails) => {
    setEmails(newEmails);
  };

   // Handler function to update the list of "BCC" emails
  const handleBccEmailsChange = (newEmails) => {
    setBccEmails(newEmails);
  };
  

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

const handleFormSubmit = async (event) => {
    event.preventDefault();
    const contentAsPdf = await generatePdfFromHtml();
    try {
      const finalContent = content.trim() || 'Thank you for your business.'; // If content is empty, use default value
      const response = await fetch('https://invoice-n96k.onrender.com/api/send-invoice-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emails,
          bcc: bccEmails,
          content: finalContent,
          companyName: signupdata.companyname,
          customdate: formatCustomDate(invoiceData.date),
          duedate: formatCustomDate(invoiceData.duedate),
          InvoiceNumber: invoiceData.InvoiceNumber,
          amountdue: invoiceData.amountdue,
          currencyType: signupdata.CurrencyType,
          amountdue1: invoiceData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0),
          pdfAttachment: contentAsPdf,
        }),
      });

      if (response.ok) {
        console.log('Email sent successfully!');
        // setShowModal(false);
        setShowEmailAlert(true);
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
};

const handleDepositFormSubmit = async (event) => {
    event.preventDefault();
    const contentAsPdf = await generatePdfFromHtml();
    try {
      const finalContent = content.trim() || 'Thank you for your business.'; // If content is empty, use default value
      const response = await fetch('https://invoice-n96k.onrender.com/api/send-deposit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emails,
          bcc: bccEmails,
          content: finalContent,
          companyName: signupdata.companyname,
          customdate: formatCustomDate(invoiceData.date),
          duedate: formatCustomDate(savedDepositData.duedepositDate),
          depositamount:savedDepositData.depositamount,
          InvoiceNumber: invoiceData.InvoiceNumber,
          currencyType: signupdata.CurrencyType,
          pdfAttachment: contentAsPdf,
        }),
      });

      if (response.ok) {
        console.log('Email sent successfully!');
        // setShowModal(false);
        setShowSendEmailModal(false)
        setShowEmailAlert(true);
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
};

const handleAlertClose = () => {
  setShowEmailAlert(false); // Close the alert
};

const generatePdfFromHtml = async () => {
  return new Promise((resolve, reject) => {
    const content = document.getElementById('invoiceContent').innerHTML;
const opt = {
  filename:     'myfile.pdf',
  html2canvas:  { scale: 3 }, // Increase scale for better resolution
  jsPDF:        { unit: 'in', format: 'A4', orientation: 'portrait' },
  userUnit: 450 / 210 
};

html2pdf().from(content).set(opt).toPdf().get('pdf').then(function(pdf) {
  // pdf.setSelectableText(true);
  const pdfAsDataUri = pdf.output('datauristring', 'pdf');
  resolve(pdfAsDataUri);
}).catch(function(error) {
  reject(error);
});
  });
};

const convertToPdf = () => {
  const content = document.getElementById('invoiceContent').innerHTML;
  
  const opt = {
      filename: 'invoice.pdf',
      html2canvas: { scale: 3 }, // Increase scale for better resolution
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
      userUnit: 450 / 210
  };

  html2pdf().from(content).set(opt).save(); // Convert to PDF and save automatically
};

// const generatePDF = async () => {
//   try {
//     setPdfExportVisible(true);
//     const timestamp = Date.now();
//     const pdfContent = (
//       <Document>
//         <Page size="A4">
//           <View style={{fontSize:"14px"}}>
//             {/* Header */}
//             <View style={{...styles.header,padding: 20}}>
//               <View style={styles.companyInfo}>
//                 <Text style={styles.invoiceHeader}>{signupdata.companyname}</Text>
//               </View>
//               <View style={styles.customerInfo}>
//                 <Text style={styles.invoiceHeader}>Invoice</Text>
//                 <Text>{signupdata.email}</Text>
//                 <Text>{signupdata.address}</Text>
//               </View>
//             </View>

//             <View style={{...styles.bgheader}}>
//               <View style={{...styles.header,padding: 20}}>
//                 <View style={styles.companyInfo}>
//                     <Text>BILL TO</Text>
//                     <Text style={{paddingTop:"10px"}}>{invoiceData.customername}</Text>
//                     <Text>{invoiceData.customeremail}</Text>
//                 </View>
//                 <View style={styles.Info}>
//                   <Text>Invoice #</Text>
//                   <Text style={{paddingTop:"10px"}}>Date</Text>
//                   <Text>Due date</Text>
//                 </View>
//                 <View style={styles.Info}>
//                   <Text>{invoiceData.InvoiceNumber}</Text>
//                   <Text style={{paddingTop:"10px"}}>{formatCustomDate(invoiceData.date)}</Text>
//                   <Text>{formatCustomDate(invoiceData.duedate)}</Text>
//                 </View>
//               </View>
//             </View>

//             <View style={{...styles.bgbottom, fontSize:"14px"}}>
//               <View style={{...styles.header,padding: 20}}>
//                   <View style={styles.div40}>
//                     <Text>ITEM</Text>
//                   </View>
//                   <View style={styles.div20}>
//                     <Text>QUANTITY</Text>
//                   </View>
//                   <View style={styles.div20}>
//                     <Text>PRICE</Text>
//                   </View>
//                   <View style={styles.div20}>
//                     <Text>AMOUNT</Text>
//                   </View>
//               </View>
//             </View>
//             {/* Item list */}
//             <View style={styles.bgbottom}>
//               {items.map(item => (
//                 <View style={{padding: 20}} key={item._id}>
//                   <View style={{...styles.header}}>
//                     <View style={styles.div40}>
//                       <Text style={styles.itemCell}>{item.itemname}</Text>
//                       <Text style={styles.itemCell}>{item.description}</Text>
//                     </View>
//                     <View style={styles.div20}>
//                       <Text style={styles.itemCell}>{item.itemquantity}</Text>
//                     </View>
//                     <View style={styles.div20}>
//                       <Text style={styles.itemCell}>{item.price}</Text>
//                     </View>
//                     <View style={styles.div20}>
//                       <Text style={styles.itemCell}>{item.amount}</Text>
//                     </View>
//                   </View>
//                 </View>
//               ))}
//             </View>
//             {/* Total */}
//             <View style={styles.bgbottom}>
//               <View style={{...styles.totalRow,padding: 20}}>
//                 <View style={styles.div40}></View>
//                 <View style={styles.Info1}>
//                   <Text>Subtotal</Text>
//                   <Text>Total</Text>
//                 </View>
//                 <View style={styles.Info1}>
//                   <Text>{invoiceData.subtotal}</Text>
//                   <Text>{invoiceData.total}</Text>
//                 </View>
//                 {/* <View style={styles.Info}></View> */}
//               </View>
//             </View>
//             {/* Transactions */}
//             {transactions.map(transaction => (
//               <View style={{...styles.itemRow}} key={transaction._id}>
//                 {/* <View style={styles.customerInfo}></View> */}
//                 <View style={styles.customerInfo}>
//                   <Text>Paid on {transaction.paiddate}</Text>
//                 </View>
//                 <View style={styles.Info1}>
//                   <Text><CurrencySign />{transaction.paidamount}</Text>
//                 </View>
//               </View>
//             ))}
//             {/* Amount Due */}
//             <View style={{...styles.totalRow, padding:20}}>
//               <View style={{...styles.Info1}}></View>
//               <View style={{...styles.div20}}></View>
//               <View style={{...styles.bgcolor}}>
//                 <Text>Amount Due</Text>
//                 <Text>
//                 <CurrencySign />{invoiceData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0)}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </Page>
//       </Document>
//     );

//     // Generate PDF blob
//     const blob = await pdf(pdfContent).toBlob();
//     const fileName = `invoice-${timestamp}.pdf`;
//     const url = URL.createObjectURL(blob);

//     // Create a link element to download the PDF
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = fileName;
//     a.click();

//     // Cleanup
//     URL.revokeObjectURL(url);
//     setPdfExportVisible(false);
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     setPdfExportVisible(false);
//   }
// };


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
                                        <li><a className="dropdown-item" onClick={convertToPdf}>Pdf</a></li>
                                        <li><a className="dropdown-item" onClick={ () => handleEditContent(invoiceData)}>Edit</a></li>
                                        <li><a className="dropdown-item" onClick={() => handleRemove(invoiceData._id)}>Remove</a></li>
                                    </ul>
                                </div>
                            
                            </div>
                            <div className="col-lg-1">
                                <a className='btn rounded-pill btn-danger text-white fw-bold' data-bs-toggle="modal" data-bs-target="#sendEmailModal">Send</a>
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
                                        <button type="button" class="btn-close" onClick={()=>{
                                            // setmessage(false);
                                            setShowAlert("");
                                          }}></button>

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
                                                  <p><CurrencySign />{item.price}</p>
                                              </div>
                                              <div className='col-lg-2 col-md-2 col-sm-2 col-5 invoice-contentcol-2'>
                                                  <p> <CurrencySign />{item.amount}</p>
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
                                                <p className='mb-2'><CurrencySign />{invoiceData.subtotal}</p>
                                                <p className=''><CurrencySign />{invoiceData.total}</p>
                                            </div>
                                          </div><hr />
                                            {transactions.map((transaction) => (
                                            <div className='row padding-20'  key={transaction._id}>
                                            
                                                <div className="col-lg-6 col-sm-6 col-md-6  col-2 invoice-contentcol-2">.</div>
                                                <div className="col-lg-3 col-sm-3 col-md-3 col-6 invoice-contentcol-8">
                                                    <p className='mb-2'>{transaction.method == "deposit" ? "Deposit" : "Paid"} on {formatCustomDate(transaction.paiddate)}</p>
                                                </div>
                                                <div className="col-lg-3 col-sm-3 col-md-3 col-4 invoice-contentcol-2">
                                                    <p><CurrencySign />{transaction.paidamount}</p>
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
                                                        <CurrencySign />{roundOff(invoiceData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0))}
                                                      </p>
                                                  </div>
                                              </div>
                                            </div>
                                    {/* </div> */}
                                </div>
                            </div>

                            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
                              <div className='mb-2'>
                                  {showEmailAlert && (
                                      <div className="alert alert-success row" role="alert">
                                        <div className="col-11">
                                          <p className='mb-0'>Email sent successfully!</p>
                                        </div>
                                        <button type="button" className="btn-close" aria-label="Close" onClick={handleAlertClose}></button>
                                      </div>
                                    )}
                                </div>
                                <div className='box1 rounded adminborder px-4 py-5'>
                                    <div className="row">
                                            <div className="col-6">
                                                <p>Total</p>
                                                <p>Paid</p>
                                            </div>
                                            <div className="col-6 text-end">
                                                <p><CurrencySign/>{invoiceData.total}</p>
                                                {console.log(transactions)}
                                                
                                                
                                                <p><CurrencySign/>{roundOff(transactions.reduce((total, payment) => total + payment.paidamount, 0))}</p>
                                               
                                            </div>

                                            {/* <!-- Button trigger modal --> */}
                                            {!transactions.find(transaction => {
                                                  return transaction.method === "deposit";
                                                }) ? savedDepositData == "" || parseFloat(savedDepositData.depositamount) === 0 ? (
                                                <a className='greenclr pointer mb-3' data-bs-toggle="modal" data-bs-target="#exampleModaldeposit">
                                                  Request a deposit
                                                </a>
                                              ) : (
                                                <p>
                                                  Request a deposit (<CurrencySign />{savedDepositData.depositamount})
                                                  <a className='greenclr pointer mb-3 text-decoration-none ms-2' data-bs-toggle="modal" data-bs-target="#exampleModaldeposit" onClick={handleEditModal}>Edit</a><br />
                                                  <a className='text-danger pointer mb-3 text-decoration-none' onClick={handleMarkDeposit}>Mark Deposit</a>
                                                </p>
                                              ) : null}
                                              {/* <a className='greenclr pointer mb-3' data-bs-toggle="modal" data-bs-target="#exampleModaldeposit">
                                                  Request a deposit
                                              </a> */}
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
                    <p className='mb-0'><CurrencySign />{transaction.paidamount}</p>
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

{/* email model  */}
<div class="modal fade" id="sendEmailModal" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-4 fw-bold" id="exampleModalLabel">Send document</h1>
                <button type="button" class="btn-close" id="closebutton" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form onSubmit={handleFormSubmit}>
                    <div class="row mb-3">
                        <label for="to" class="col-sm-2 col-form-label">To</label>
                        <div class="col-sm-10">
                            {/* <input type="text" class="form-control" id="to" name="to" value={invoiceData.customeremail}/> */}
                            <ReactMultiEmail
                              emails={emails}
                              onChange={handleEmailChange}
                              getLabel={(
                                email,
                                index,
                                removeEmail
                              ) => (
                                <div data-tag="true" key={index}>
                                  {email}
                                  <span
                                    data-tag-handle="true"
                                    onClick={() => removeEmail(index)}
                                  >
                                    ×
                                  </span>
                                </div>
                              )}
                              placeholder="Add more people..."
                              style={{
                                input: { width: '90%' },
                                emailsContainer: { border: '1px solid #ccc' },
                                emailInput: { backgroundColor: 'lightblue' },
                                invalidEmailInput: { backgroundColor: '#f9cfd0' },
                                container: { marginTop: '20px' },
                              }}
                      
                                    />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="bcc" class="col-sm-2 col-form-label">Bcc</label>
                        <div class="col-sm-10">
                        <ReactMultiEmail
                          emails={bccEmails}
                          onChange={handleBccEmailsChange}
                          getLabel={(
                            email,
                            index,
                            removeEmail
                          ) => (
                            <div data-tag="true" key={index}>
                              {email}
                              <span
                                data-tag-handle="true"
                                onClick={() => removeEmail(index)}
                              >
                                ×
                              </span>
                            </div>
                          )}
                          placeholder="Add BCC recipients..."
                          style={{
                            input: { width: '90%' },
                            emailsContainer: { border: '1px solid #ccc' },
                            emailInput: { backgroundColor: 'lightblue' },
                            invalidEmailInput: { backgroundColor: '#f9cfd0' },
                            container: { marginTop: '20px' },
                          }}
                        />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="content" class="form-label">Content</label>
                        <textarea class="form-control" id="content" name="content" rows="5" value={content} onChange={handleContentChange}></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Send</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

{/* deposit modal  */}
<form action="">
  <div class="modal fade" id="exampleModaldeposit" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header p-4">
          <h1 class="modal-title fs-3 fw-bold" id="exampleModalLabel">Request a deposit</h1>
          <button type="button" class="btn-close" id="closebutton" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body p-4">
          <input type="hidden" id="deposit_uniqueid" value="uniqueid_here"/>

          <div class="mb-3 row">
            <div className="col-6 fw-bold fs-5">
              <p>Total amount</p>
            </div>
            <div className="col-6 text-end fw-bold fs-5">
              <p>
                <CurrencySign />
                {roundOff(
                  invoiceData.total -
                  transactions.reduce((total, payment) => total + payment.paidamount, 0) -
                  amount
                )}
              </p>            
            </div>
          </div>
          <div class="mb-3 row">
            <div className="col-5">
              <label for="number" class="form-label">Percentage</label>
              <div className='input-group mb-4'>
              <input type="number" className="form-control" id="depositpercentage" value={depositpercentage} onChange={handlePercentageChange} min="0" />
                <span class="input-group-text">%</span>
              </div>
            </div>
            <div className="col-2 fw-bold fs-5">
              <p className='pt-3 fs-2 ps-5'>=</p>
            </div>
            <div className="col-5">
              <label for="text" class="form-label">Amount</label>
              <div className='input-group mb-4'>
              <input type="text" className="form-control" id="amount" value={amount} readOnly />
                <span class="input-group-text"><CurrencySign /></span>
              </div>
            </div>
            <div className="col-5">
                <label for="date" class="form-label" id='duedepositdate'>Due Date</label>
                <input type="date" class="form-control" value={duedepositDate} onChange={handleDateChange} />
            </div>
          </div>
        </div>
        <div class="modal-footer p-4">
          <a data-bs-dismiss="modal" className='pointer text-decoration-none text-dark'>Close</a>
          <a className='greenclr ms-2 text-decoration-none pointer' data-bs-dismiss="modal" onClick={handleSave}>Save</a>
          {(depositpercentage === '' || parseInt(depositpercentage) < 1) ? (
            <button className='py-2 px-3 text-decoration-none bg-tertiary text-dark fw-bold rounded' disabled>Save & Send</button>
          ) : (
            <a href="" className='py-2 px-3 text-decoration-none pointer bg-success text-white fw-bold rounded' data-bs-dismiss="modal" id='' onClick={handleSaveAndSend}>Save & Send</a>
          )}
          {/* <a href="" className='py-2 px-3 text-decoration-none pointer bg-success text-white fw-bold rounded'>Save & Send</a> */}
        </div>
      </div>
    </div>
  </div>
</form>

{/* Email modal-2 */}
{showSendEmailModal ?
  <div class="modal fade show" id="sendEmailModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style={{display: "block"}}>
{/* <div class="modal fade" id="sendEmailModal2" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true"> */}
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-4 fw-bold" id="exampleModalLabel">Send document</h1>
                <button type="button" class="btn-close" onClick={ ()=> setShowSendEmailModal(false)}></button>
            </div>
            <div class="modal-body">
                <form onSubmit={handleDepositFormSubmit}>
                    <div class="row mb-3">
                        <label for="to" class="col-sm-2 col-form-label">To</label>
                        <div class="col-sm-10">
                            {/* <input type="text" class="form-control" id="to" name="to" value={invoiceData.customeremail}/> */}
                            <ReactMultiEmail
                              emails={emails}
                              onChange={handleEmailChange}
                              getLabel={(
                                email,
                                index,
                                removeEmail
                              ) => (
                                <div data-tag="true" key={index}>
                                  {email}
                                  <span
                                    data-tag-handle="true"
                                    onClick={() => removeEmail(index)}
                                  >
                                    ×
                                  </span>
                                </div>
                              )}
                              placeholder="Add more people..."
                              style={{
                                input: { width: '90%' },
                                emailsContainer: { border: '1px solid #ccc' },
                                emailInput: { backgroundColor: 'lightblue' },
                                invalidEmailInput: { backgroundColor: '#f9cfd0' },
                                container: { marginTop: '20px' },
                              }}
                      
                                    />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="bcc" class="col-sm-2 col-form-label">Bcc</label>
                        <div class="col-sm-10">
                        <ReactMultiEmail
                          emails={bccEmails}
                          onChange={handleBccEmailsChange}
                          getLabel={(
                            email,
                            index,
                            removeEmail
                          ) => (
                            <div data-tag="true" key={index}>
                              {email}
                              <span
                                data-tag-handle="true"
                                onClick={() => removeEmail(index)}
                              >
                                ×
                              </span>
                            </div>
                          )}
                          placeholder="Add BCC recipients..."
                          style={{
                            input: { width: '90%' },
                            emailsContainer: { border: '1px solid #ccc' },
                            emailInput: { backgroundColor: 'lightblue' },
                            invalidEmailInput: { backgroundColor: '#f9cfd0' },
                            container: { marginTop: '20px' },
                          }}
                        />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="content" class="form-label">Content</label>
                        <textarea class="form-control" id="content" name="content" rows="5" value={content} onChange={handleContentChange}></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={ ()=> setShowSendEmailModal(false)}>Close</button>
                        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Send</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div> : null
}
    </div>
  )
}
