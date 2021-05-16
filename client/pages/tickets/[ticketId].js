import React from "react";
import buildClient from "../../api/build-client";

const TicketShow = ({ ticket }) => {
  console.log("ticket", ticket);
  return (
    <div>
      <h1> {ticket.title} </h1>
      <h4> Price:{ticket.price} </h4>
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
