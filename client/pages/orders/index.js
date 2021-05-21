import buildClient from "../../api/build-client";

const Order = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title}-{order.status}
          </li>
        );
      })}
    </ul>
  );
};
export default Order;
export const getServerSideProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get(`/api/orders`);
  return { props: { orders: data } };
};
