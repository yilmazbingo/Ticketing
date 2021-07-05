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
      <h1> {ticket && ticket.title} </h1>
      {ticket && <h4> Price:{ticket.price} </h4>}
      {errors}
      {/* react passess "event" to events {doRequest}*/}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
};

export default TicketShow;

export const getServerSideProps = async (context) => {
  const { ticketId } = context.query;
  const client = buildClient(context);
  let ticket;
  try {
    const ticketResponse = await client.get(`/api/tickets/${ticketId}`);
    ticket = ticketResponse.data;
  } catch (e) {
    console.log("error in ticket detail page", e);
  }
  return { props: { ticket } };
};
