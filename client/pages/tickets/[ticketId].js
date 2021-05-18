import React from "react";
import buildClient from "../../api/build-client";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push(`/orders/${order.id}`),
  });
  return (
    <div>
      <h1> {ticket.title} </h1>
      <h4> Price:{ticket.price} </h4>
      {errors}
      <button className="btn btn-primary" onClick={doRequest}>
        Purchase
      </button>
    </div>
  );
};

export default TicketShow;

export const getServerSideProps = async (context) => {
  const { ticketId } = context.query;
  const client = buildClient(context);
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { props: { ticket: data } };
};
