import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./SubscriptionPlansPage.css";

const plans = [
  { name: "Free", price: 0, duration: "5 minutes" },
  { name: "Bronze", price: 10, duration: "7 minutes" },
  { name: "Silver", price: 50, duration: "10 minutes" },
  { name: "Gold", price: 100, duration: "Unlimited" },
];

const SubscriptionPlansPage = () => {
  const user = useSelector((state) => state.currentuserreducer?.result);
  const navigate = useNavigate();
  const [popupMessage, setPopupMessage] = useState("");

  const handlePayment = (plan) => {
    if (!user) {
      setPopupMessage("Please sign in to purchase a plan.");
      setTimeout(() => navigate("/signin"), 2000);
      return;
    }

    if (plan.price === 0) {
      setPopupMessage("You are already on the Free plan.");
      return;
    }

    // Navigate to payment page with selected plan
    navigate("/payment", { state: { plan } });
  };

  const closePopup = () => {
    setPopupMessage("");
  };

  return (
    <div className="subscription-container">
      <h2>Choose Your Subscription Plan</h2>
      <div className="plans-wrapper">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`plan-card ${plan.name.toLowerCase()}`}
          >
            <h2>{plan.name}</h2>
            <p>
              <strong>Price:</strong> ₹{plan.price}
            </p>
            <p>
              <strong>Watch Time:</strong> {plan.duration}
            </p>
            <button onClick={() => handlePayment(plan)}>
              Buy {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Popup message */}
      {popupMessage && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-box">
            <p>{popupMessage}</p>
            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlansPage;
