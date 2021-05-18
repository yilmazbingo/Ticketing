import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import buildClient from "../../api/build-client";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    // we call this otherwise we would wait 1000 ms to see the time on the screen
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>order Expired</div>;
  }
  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={(token) => console.log(token)}
        stripeKey={`${process.env.STRIPE_API_KEY}`}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  );
};

export default OrderShow;

export const getServerSideProps = async (context) => {
  const { orderId } = context.query;
  const client = buildClient(context);
  const { data } = await client.get(`/api/orders/${orderId}`);
  const { data: currentUser } = await client.get("/api/users/currentuser");

  return { props: { order: data, currentUser } };
};
