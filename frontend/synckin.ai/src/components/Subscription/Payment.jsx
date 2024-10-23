import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();
   const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session_id");

    const finalizePayment = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          "http://localhost:5000/api/stripe/payment-success",
          {
            session_id: sessionId,
          },
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        console.log("Session ID to finalize payment:", sessionId);
        console.log(response.data); // Handle success response
          if (response.status === 200) {
             alert("Payment successful!");
            navigate("/dashboard"); // Redirect to the dashboard
          }
      } catch (error) {
        console.error("Error finalizing payment:", error);
      }
    };

    if (sessionId) {
      finalizePayment();
    }
  }, [location,navigate]);

  return <div>Processing your payment...</div>;
};

export default PaymentSuccess;
