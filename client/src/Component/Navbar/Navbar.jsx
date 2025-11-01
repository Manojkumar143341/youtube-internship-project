import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import logo from "./logo.ico";
import "./Navbar.css";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { RiVideoAddLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiUserCircle } from "react-icons/bi";
import { MdPersonAdd } from "react-icons/md";
import { FaVideo } from "react-icons/fa";  // Video call icon
import Searchbar from './Searchbar/Searchbar';
import Auth from '../../Pages/Auth/Auth';
import axios from "axios";
import { login, logout as reduxLogout } from "../../action/auth";
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { setcurrentuser } from '../../action/currentuser';
import {jwtDecode }from "jwt-decode"; // Correct import without braces
import Videoupload from '../../Pages/Videoupload/Videoupload';  // Import Video Upload component

const Navbar = ({ toggledrawer, seteditcreatechanelbtn }) => {
  const [authbtn, setauthbtn] = useState(false);
  const [user, setuser] = useState(null);
  const [profile, setprofile] = useState([]);
  const [showPeopleMenu, setShowPeopleMenu] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false); // NEW: Show/hide video upload modal

  // New state for plan selection in modal
  const [selectedPlan, setSelectedPlan] = useState("Bronze");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentuser = useSelector(state => state.currentuserreducer);

  const successlogin = useCallback(() => {
    if (profile.email) {
      dispatch(login({ email: profile.email }));
    }
  }, [dispatch, profile.email]);

  const handleLogout = useCallback(() => {
    dispatch(setcurrentuser(null));
    dispatch(reduxLogout());
    googleLogout();
    localStorage.clear();
  }, [dispatch]);

  const google_login = useGoogleLogin({
    onSuccess: tokenResponse => setuser(tokenResponse),
    onError: (error) => console.log("Login Failed", error)
  });

  useEffect(() => {
    if (user) {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          Accept: 'application/json'
        }
      }).then((res) => {
        setprofile(res.data);
        successlogin();
      });
    }
  }, [user, successlogin]);

  useEffect(() => {
    const token = currentuser?.token;
    if (token) {
      const decodetoken = jwtDecode(token);
      if (decodetoken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }
    dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
  }, [currentuser?.token, dispatch, handleLogout]);

  const handlePeopleOption = (option) => {
    if (option === "Create Group") {
      navigate("/groups");
    } else if (option === "Invite Others") {
      alert("Invite functionality will be here");
    } else if (option === "Upgrade Plan") {
      setShowPlanModal(true);
    }
    setShowPeopleMenu(false);
  };

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay Payment
  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    try {
      // Call backend to create order
      const { data } = await axios.post("/api/payment/create-order", {
        plan: selectedPlan,
      }, {
        headers: { Authorization: `Bearer ${currentuser.token}` }
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY, // Add your Razorpay key in env variable
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Your-Tube",
        description: `${selectedPlan} plan subscription`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyRes = await axios.post("/api/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan: selectedPlan,
            }, {
              headers: { Authorization: `Bearer ${currentuser.token}` }
            });

            if (verifyRes.data.success) {
              alert("Payment successful! Plan upgraded.");
              dispatch(login(verifyRes.data.updatedUser)); // Update redux user state
              setShowPlanModal(false);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            alert("Payment verification error: " + (err.response?.data?.message || err.message));
          }
        },
        prefill: {
          email: currentuser.result.email,
        },
        theme: {
          color: "#F37254",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      alert("Server error: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <div className="Container_Navbar">
        <div className="Burger_Logo_Navbar">
          <div className="burger" onClick={toggledrawer}>
            <p></p><p></p><p></p>
          </div>
          <Link to="/" className="logo_div_Navbar">
            <img src={logo} alt="logo" />
            <p className="logo_title_navbar">Your-Tube</p>
          </Link>
        </div>

        <Searchbar />

        {/* Mobile menu button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        {/* Icons and auth section */}
        <div className={`Navbar_Right ${mobileMenuOpen ? 'open' : ''}`}>

          {/* VIDEO UPLOAD ICON */}
          <RiVideoAddLine
            size={22}
            className="vid_bell_Navbar cursor-pointer"
            title="Upload Video"
            onClick={() => setShowVideoUpload(true)}
          />

          {/* Video Call icon */}
          <FaVideo
            size={22}
            className="vid_bell_Navbar cursor-pointer"
            title="Video Call"
            onClick={() => navigate('/video-call')}
          />

          <div className="relative">
            <MdPersonAdd
              size={22}
              className="vid_bell_Navbar cursor-pointer"
              title="Add People"
              onClick={() => setShowPeopleMenu(!showPeopleMenu)}
            />
            {showPeopleMenu && (
              <div className="people_dropdown_menu">
                <button onClick={() => handlePeopleOption("Create Group")}>Create Group</button>
                <button onClick={() => handlePeopleOption("Invite Others")}>Invite Others</button>
                <button onClick={() => handlePeopleOption("Upgrade Plan")}>Upgrade Plan</button>
              </div>
            )}
          </div>

          <div className="apps_Box">
            {[...Array(9)].map((_, i) => (
              <p className="appBox" key={i}></p>
            ))}
          </div>

          <IoMdNotificationsOutline size={22} className="vid_bell_Navbar" />

          <div className="Auth_cont_Navbar">
            {currentuser ? (
              <div className="Chanel_logo_App" onClick={() => setauthbtn(true)}>
                <p className="fstChar_logo_App">
                  {currentuser?.result.name
                    ? currentuser?.result.name.charAt(0).toUpperCase()
                    : currentuser?.result.email.charAt(0).toUpperCase()}
                </p>
              </div>
            ) : (
             <p className='Auth_Btn' onClick={() => navigate("/signin")}>
  <BiUserCircle size={22} />
  <b>Sign in</b>
</p>

            )}
          </div>
        </div>
      </div>

      {authbtn && (
        <Auth
          seteditcreatechanelbtn={seteditcreatechanelbtn}
          setauthbtn={setauthbtn}
          user={currentuser}
        />
      )}

      {showGroupModal && (
        <div className="modal">
          <h2>Create Group</h2>
          <input type="text" placeholder="Group Name" />
          <button onClick={() => alert("Group Created!")}>Create</button>
          <button onClick={() => setShowGroupModal(false)}>Close</button>
        </div>
      )}

      {showPlanModal && (
        <div className="modal">
          <h2>Upgrade Plan</h2>
          <ul>
            {[
              { name: "Bronze", price: 10, duration: "7 mins" },
              { name: "Silver", price: 50, duration: "10 mins" },
              { name: "Gold", price: 100, duration: "Unlimited" },
            ].map((plan) => (
              <li key={plan.name}>
                <label>
                  <input
                    type="radio"
                    name="plan"
                    value={plan.name}
                    checked={selectedPlan === plan.name}
                    onChange={() => setSelectedPlan(plan.name)}
                  />
                  {`🥉 ${plan.name} - ₹${plan.price} (${plan.duration} video watch)`}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handlePayment}>Pay Now</button>
          <button onClick={() => setShowPlanModal(false)}>Close</button>
        </div>
      )}

      {/* Video Upload Modal */}
      {showVideoUpload && (
        <Videoupload setvideouploadpage={setShowVideoUpload} />
      )}
    </>
  );
};

export default Navbar;
