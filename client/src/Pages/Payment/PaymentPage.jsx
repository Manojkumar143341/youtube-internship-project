import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateUserPlan } from "../../action/auth";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentuserreducer?.result);

  // Get plan info passed from subscription page
  const { plan } = location.state || {};

  useEffect(() => {
    if (!plan || !user) {
      navigate("/subscriptionplans"); // redirect if no plan or user
      return;
    }

    const makePayment = async () => {
      try {
        const { data } = await axios.post("http://localhost:5000/api/payment/createOrder", {
          amount: plan.price * 100,
          plan: plan.name,
        });

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount: data.amount,
          currency: "INR",
          name: "Your App Name",
          description: `Purchase ${plan.name} Plan`,
          order_id: data.id,
          handler: function (response) {
            axios
              .post("http://localhost:5000/api/payment/verify", {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                plan: plan.name,
                email: user.email,
              })
              .then(() => {
                alert("Payment successful!");
                dispatch(updateUserPlan(plan.name));
                navigate("/subscriptionplans"); // back to plans page or dashboard
              })
              .catch(() => alert("Payment verification failed."));
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: { color: "#3399cc" },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error(error);
        alert("Payment failed. Please try again.");
      }
    };

    makePayment();
  }, [plan, user, dispatch, navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Redirecting to Payment...</h2>
      <p>Please wait while we prepare your payment.</p>
    </div>
  );
};

export default PaymentPage;
