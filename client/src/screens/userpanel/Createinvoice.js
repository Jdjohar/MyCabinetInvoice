import React,{useState,useEffect} from 'react'
import { format } from 'date-fns';
import {useNavigate} from 'react-router-dom'
import { ColorRing } from  'react-loader-spinner'
import Usernav from './Usernav';
import Usernavbar from './Usernavbar';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css'

export default function Createinvoice() {
//   const [ loading, setloading ] = useState(true);
    const [customers, setcustomers] = useState([]);
    const [items, setitems] = useState([]);
    const [searchcustomerResults, setSearchcustomerResults] = useState([]);
    const [searchitemResults, setSearchitemResults] = useState([]);
    const [quantityMap, setQuantityMap] = useState({});
    const [discountMap, setDiscountMap] = useState({});
    const [discount, setDiscount] = useState();
    const [selectedCustomerDetails, setSelectedCustomerDetails] = useState({
        name: '',
        email: ''
    });
    const [isCustomerSelected, setIsCustomerSelected] = useState(false);
    const [taxPercentage, setTaxPercentage] = useState(0);



    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        fetchcustomerdata();
        fetchitemdata();
        
    }, [])
    let navigate = useNavigate();

    const fetchcustomerdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`http://invoice-n96k.onrender.com/api/customers/${userid}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setcustomers(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchitemdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`http://invoice-n96k.onrender.com/api/itemdata/${userid}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setitems(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // const onChangecustomer=(event)=>{
    //     setSearchcustomerResults([...searchcustomerResults,event]);
    // }

    const onChangeitem=(event)=>{
        setSearchitemResults([...searchitemResults,event]);
    }

    // const onChangeQuantity = (event, itemId) => {
    //     const newQuantity = event.target.value ? parseInt(event.target.value) : 1;
    
    //     // Update quantity for the corresponding item
    //     setQuantityMap((prevMap) => ({
    //       ...prevMap,
    //       [itemId]: newQuantity,
    //     }));
    //   };

    const onChangeQuantity = (event, itemId) => {
        let newQuantity = event.target.value ? parseInt(event.target.value) : 1;
        newQuantity = Math.max(newQuantity, 0); // Ensure quantity is not negative
      
        setQuantityMap((prevMap) => ({
          ...prevMap,
          [itemId]: newQuantity,
        }));
      };

      const onDeleteItem = (itemIdToDelete) => {
        setSearchitemResults((prevResults) => {
            return prevResults.filter((item) => item.value !== itemIdToDelete);
        });
        // Perform any other actions related to deletion in the UI
    };

    const onChangecustomer = (event) => {
        const selectedCustomerId = event.value;
        const selectedCustomer = customers.find((customer) => customer._id === selectedCustomerId);

        if (selectedCustomer) {
            setSelectedCustomerDetails({
                name: selectedCustomer.name,
                email: selectedCustomer.email
            });
            setIsCustomerSelected(true); // Set the flag to indicate a customer is selected
        }

        setSearchcustomerResults([...searchcustomerResults, event]);
    };
    
    const calculateDiscountedAmount = (price, quantity, discount) => {
        const totalAmount = price * quantity;
        const discountedAmount = totalAmount - Math.max(discount, 0); // Ensure discount is not negative
        return discountedAmount > 0 ? discountedAmount : 0;
      };
      
      
    const onDiscountChange = (event, itemId) => {
        const discountValue = event.target.value;
        const regex = /^\d*\.?\d{0,2}$/; // Regex to allow up to two decimal places
    
        // Check if the input matches the allowed format
        if (regex.test(discountValue)) {
            const newDiscount = discountValue !== '' ? parseFloat(discountValue) : 0;
            const selectedPrice = items.find((i) => i._id === itemId)?.price || 0;
            const quantity = quantityMap[itemId] || 1;
            const totalAmount = selectedPrice * quantity;
    
            const discountedAmount = totalAmount - (totalAmount * newDiscount) / 100;
    
            setDiscountMap((prevMap) => ({
                ...prevMap,
                [itemId]: newDiscount,
            }));
    
            // Use discountedAmount in your code where needed
            console.log('Discounted Amount:', discountedAmount.toFixed(2)); // Output the discounted amount
        } else {
            // Handle invalid input (e.g., show a message to the user)
            console.log('Invalid input for discount');
        }
    };
    
    const calculateSubtotal = () => {
        let subtotal = 0;
    
        searchitemResults.forEach((item) => {
          const selectedItem = items.find((i) => i._id === item.value);
          const itemPrice = selectedItem?.price || 0;
          const itemId = item.value;
          const quantity = quantityMap[itemId] || 1;
          const discount = discountMap[itemId] || 0;
    
          const discountedAmount = calculateDiscountedAmount(itemPrice, quantity, discount);
    
          subtotal += discountedAmount;
        });
    
        return subtotal;
      };

      // Function to handle tax change
      const handleTaxChange = (event) => {
        let enteredTax = event.target.value;
        // Restrict input to two digits after the decimal point
        const regex = /^\d*\.?\d{0,2}$/; // Regex to allow up to two decimal places
        if (regex.test(enteredTax)) {
            // Ensure that the entered value is a valid number
            enteredTax = parseFloat(enteredTax);
            setTaxPercentage(enteredTax);
        }
    };
    

    // Function to calculate tax amount
    const calculateTaxAmount = () => {
        const subtotal = calculateSubtotal();
        const taxAmount = (subtotal * taxPercentage) / 100;
        return taxAmount;
    };
    
    // Function to calculate total amount
const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTaxAmount();
    const totalAmount = subtotal + taxAmount;
    return totalAmount;
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
                    <div className='mx-4'>
        
                        <div className=''>
                        <div className='row py-4 px-2 breadcrumbclr'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='fs-35 fw-bold'>Invoice</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Team</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btn-danger text-white fw-bold'>Save</button>
                            </div>
                        </div>
                        {/* <div className='txt px-4 py-4 breadcrumbclr'>
                            <h2 className='fs-35 fw-bold'>Invoice</h2>
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb mb-0">
                                    <li class="breadcrumb-item"><a href="" className='txtclr text-decoration-none'>Dashboard</a></li>
                                    <li class="breadcrumb-item"><a href="" className='txtclr text-decoration-none'>Invoice</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">Create</li>
                                </ol>
                            </nav>
                        </div> */}
                        <div className='box1 rounded adminborder p-4 m-2 mb-5'>
                            <div className='row me-2'>
                                <div className="col-5">
                                    {isCustomerSelected ? (
                                        <div className="customerdetail p-3">
                                            <ul>
                                                <li className='fw-bold fs-4'>{selectedCustomerDetails.name}</li>
                                                <li>
                                                    <a href="" className='text-decoration-none'>Edit</a>
                                                </li>
                                            </ul>
                                            <p>{selectedCustomerDetails.email}</p>
                                        </div>
                                        ) : (
                                        <div className="search-container forms">
                                            <p className='fs-20 mb-0'>Select Customers</p>
                                            <VirtualizedSelect
                                                id="searchitems" 
                                                name="customers"
                                                className="form-control zindex op pl-0"
                                                placeholder=""
                                                onChange={onChangecustomer}
                                                options={ customers.map((customer,index)=>
                                                    ({label: customer.name, value: customer._id})
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>    
                                <div className="col-7">
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="mb-3">
                                                <label htmlFor="invoicenumbr" className="form-label">
                                                    Invoice Number
                                                </label>
                                                <input
                                                type="text"
                                                name="invoicenumbr"
                                                className="form-control"
                                                // onChange={onchange}
                                                // placeholder="Invoice Number"
                                                id="invoicenumbr"
                                                required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="mb-3">
                                                <label htmlFor="purchaseoder" className="form-label">
                                                    Purchase Order (PO) #
                                                </label>
                                                <input
                                                type="text"
                                                name="purchaseoder"
                                                className="form-control"
                                                // onChange={onchange}
                                                // placeholder="Purchase Order (PO) #"
                                                id="purchaseoder"
                                                required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="mb-3">
                                                <label htmlFor="Date" className="form-label">
                                                Date
                                                </label>
                                                <input
                                                type="date"
                                                name="Date"
                                                className="form-control"
                                                // onChange={onchange}
                                                // placeholder="Date"
                                                id="Date"
                                                required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="mb-3">
                                                <label htmlFor="duedate" className="form-label">
                                                    Due Date
                                                </label>
                                                <input
                                                type="date"
                                                name="duedate"
                                                className="form-control"
                                                // onChange={onchange}
                                                // placeholder="Due Date"
                                                id="duedate"
                                                required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>    
                            </div>

                            <div className='box1 rounded adminborder p-4 m-2'>
                                <div className="row pt-3">
                                    <div className="col-4">
                                        <p>ITEM</p>
                                    </div>
                                    <div className="col-2">
                                        <p>QUANTITY</p>
                                    </div>
                                    <div className="col-2">
                                        <p>PRICE</p>
                                    </div>
                                    <div className="col-2">
                                        <p>DISCOUNT</p>
                                    </div>
                                    <div className="col-2">
                                        <p>AMOUNT</p>
                                    </div>
                                </div>

                                <div className="row">
                                {searchitemResults.map((item) => {
                                    const selectedItem = items.find((i) => i._id === item.value);
                                    const itemPrice = selectedItem?.price || 0;
                                    const itemId = item.value;
                                    const quantity = quantityMap[itemId] || 1;
                                    const discount = discountMap[itemId] || 0;

                                    // Calculate total amount based on price and quantity
                                    // const totalAmount = itemPrice * quantity;
                                    // const formattedTotalAmount = Number(totalAmount).toLocaleString('en-IN', {
                                    //     style: 'currency',
                                    //     currency: 'INR',
                                    // });

                                    const discountedAmount = calculateDiscountedAmount(itemPrice, quantity, discount);
                                    const formattedTotalAmount = Number(discountedAmount).toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    });

                                    return (
                                        <div className='row' key={item.value}>
                                            <div className="col-4 ">
                                                <div className="mb-3 d-flex align-items-baseline justify-content-between">
                                                    <p>{item.label}</p>
                                                    <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => onDeleteItem(item.value)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div className="mb-3">
                                                <input
                                                    type="number"
                                                    name={`quantity-${itemId}`}
                                                    className="form-control"
                                                    value={quantity}
                                                    onChange={(event) => onChangeQuantity(event, itemId)}
                                                    id={`quantity-${itemId}`}
                                                    required
                                                />
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div className="mb-3">
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        className="form-control"
                                                        value={itemPrice}
                                            
                                                        // onChange={onChangeitem}
                                                        // placeholder="Due Date"
                                                        id="price"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-2 text-center">
                                                <p>₹{discount.toFixed(2)}</p>
                                            </div>
                                            <div className="col-2 text-center">
                                                <p>{formattedTotalAmount}</p>
                                            </div>
                                            <div className="col-5">
                                                <div class="mb-3">
                                                    <label htmlFor="description" className="form-label">Description</label>
                                                    <textarea
                                                        class="form-control"
                                                        id={`item-description-${itemId}`}
                                                        placeholder='Item Description'
                                                        rows="3"
                                                        value={selectedItem?.description || ''}
                                                        // readOnly
                                                    >
                                                    </textarea>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div class="mb-3">
                                                    <label htmlFor="taxInput" className="form-label">Tax</label>
                                                    <input
                                                        type="number"
                                                        name="taxInput"
                                                        className="form-control"
                                                        value={taxPercentage}
                                                        onChange={handleTaxChange}
                                                        placeholder="Enter Tax Percentage"
                                                        id="taxInput"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div class="mb-3">
                                                    <label htmlFor="Discount" className="form-label">Discount</label>
                                                    <input
                                                        type='number'
                                                        name={`discount-${itemId}`}
                                                        className='form-control'
                                                        value={discount}
                                                        onChange={(event) => onDiscountChange(event, itemId)}
                                                        placeholder='Discount'
                                                        id={`discount-${itemId}`}
                                                        min="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
        );
      })}
                                </div>
                                <hr />

                                <div className="row pt-3">
                                    <div className="col-7">
                                        <div className="search-container forms">
                                            <p className='fs-20 mb-0'>Select Item</p>
                                            <VirtualizedSelect
                                                id="searchitems" 
                                                name="items"
                                                className="form-control zindex op pl-0"
                                                placeholder=""
                                                onChange={onChangeitem}
                                                options={ items.map((item,index)=>
                                                    ({label: item.itemname, value: item._id})
                                                        
                                                )}

                                                >
                                            </VirtualizedSelect> 
                                        </div>
                                    </div>
                                    <div className="col-5">
                                        <div className="row">
                                            <div className="col-6">
                                                <p>Subtotal</p>
                                                <p>TAX {taxPercentage}%</p>
                                                <p>Total</p>
                                            </div>
                                            <div className="col-6">
                                                <p>{calculateSubtotal().toLocaleString('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR',
                                                })}</p>
                                                <p>{calculateTaxAmount().toLocaleString('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR',
                                                })}</p>
                                                <p>{calculateTotal().toLocaleString('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR',
                                                    })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="row pt-3">
                                    <div className="col-7"></div>
                                    <div className="col-5">
                                        <div className="row">
                                            <div className="col-6">
                                                <p>Amount due</p>
                                            </div>
                                            <div className="col-6">
                                                <p>₹1,920.00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='box1 rounded adminborder m-2 mt-5'>
                                <CKEditor
                                    editor={ ClassicEditor }
                                    data="<p></p>"
                                    onReady={ editor => {
                                        console.log( 'Editor is ready to use!', editor );
                                    } }
                                    onChange={ ( event, editor ) => {
                                        const data = editor.getData();
                                        console.log( { event, editor, data } );
                                    } }
                                    onBlur={ ( event, editor ) => {
                                        console.log( 'Blur.', editor );
                                    } }
                                    onFocus={ ( event, editor ) => {
                                        console.log( 'Focus.', editor );
                                    } }
                                />
                            </div>
                        </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
      
    </div>
  )
}
