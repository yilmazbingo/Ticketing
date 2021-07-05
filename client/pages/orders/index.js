import buildClient from "../../api/build-client";

const Order = ({ orders }) => {
  return (
    <ul>
      {orders &&
        orders.map((order) => {
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
  let orders;
  try {
    const ordersResponse = await client.get(`/api/orders`);
    orders = ordersResponse;
  } catch (e) {
    console.log("error in get orders", e);
  }
  if (!orders) {
    orders = null;
  }
  return { props: { orders } };
};
