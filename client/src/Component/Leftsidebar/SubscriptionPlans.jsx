// src/Components/SubscriptionPlansPage/SubscriptionPlansPage.jsx

import React from 'react';
import './SubscriptionPlans.css';

const SubscriptionPlansPage = () => {
  return (
    <div className="subscription-page">
      <h1>Choose Your Plan</h1>
      <div className="plans">
        <div className="plan-card">
          <h2>Free</h2>
          <p>5 mins video watch</p>
        </div>
        <div className="plan-card">
          <h2>Bronze</h2>
          <p>7 mins video watch - ₹10</p>
        </div>
        <div className="plan-card">
          <h2>Silver</h2>
          <p>10 mins video watch - ₹50</p>
        </div>
        <div className="plan-card">
          <h2>Gold</h2>
          <p>Unlimited video watch - ₹100</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;
