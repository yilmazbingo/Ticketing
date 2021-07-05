import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";
import buildClient from "../../api/build-client";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order && order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order && order.expiresAt) - new Date();
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
        token={({ id }) => doRequest({ token: id })}
        stripeKey={`${process.env.STRIPE_API_KEY}`}
        amount={order && order.ticket.price * 100}
        email={currentUser && currentUser.email}
      />
      {errors}
    </div>
  );
};

export default OrderShow;

export const getServerSideProps = async (context) => {
  const { orderId } = context.query;
  const client = buildClient(context);

  let currentUser, order;
  try {
    const currentUserRes = await client.get("/api/users/currentuser");
    currentUser = currentUserRes.data;
    const orderRes = await client.get(`/api/orders/${orderId}`);
    order = orderRes.data;
    console.log("order in order detail page", order);
  } catch (e) {
    console.log("error in client index server", e);
  }
  // because undefined cannot be serialized
  if (!currentUser) {
    currentUser = null;
  }
  if (!order) {
    order = null;
  }
  return { props: { currentUser, order } };
};
