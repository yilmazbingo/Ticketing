import React from "react";
import Link from "next/link";
import buildClient from "../api/build-client";

import BaseLayout from "../components/BaseLayout";

//useRequest is a hook and hooks are used inside a  component. getInitialsProps is not a component, it is a plain function. we are not allowed to fetch data inside of a component during the ssr process.
const Landing = ({ currentUser, tickets }) => {
  console.log("tickets", tickets);
  const ticketList =
    tickets &&
    tickets.map((ticket) => {
      return (
        <tr key={ticket.id}>
          <td>{ticket.title} </td>
          <td>{ticket.price} </td>
          <td>
            <Link href={`/tickets/${ticket.id}`}>View</Link>
          </td>
        </tr>
      );
    });

  return (
    <BaseLayout currentUser={currentUser.currentUser}>
      <div>
        <h1>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>{ticketList}</tbody>
          </table>
        </h1>
      </div>
    </BaseLayout>
  );
};

// when we make request on the server in next,js it will fail because of k8s/next. we need to add config
// getInitialProps can be attached to component but not getServerSideProps

export default Landing;
export const getServerSideProps = async (context) => {
  const client = buildClient(context);
  let currentUser, tickets;
  try {
    const currentUserRes = await client.get("/api/users/currentuser");
    currentUser = currentUserRes.data;
    console.log("currentUser in client index.js", currentUser);
    const ticketsRes = await client.get("api/tickets");
    tickets = ticketsRes.data;
    console.log("tickets in index.js client", tickets);
  } catch (e) {
    console.log("error in client index server", e);
  }
  // because undefined cannot be serialized
  if (!currentUser) {
    currentUser = null;
  }
  if (!tickets) {
    tickets = null;
  }
  return { props: { currentUser, tickets } };
};
// we changed the host file, ticketing.dev=localhost. So when we make request to ticketing.dev, networking layer in your machine will translate it into the 127.0.0.1:80. default port=80. 127.0.0.1:80 is bound to by ingress-nginx. it means ingress-nginx will receive that request and read it off appropriately and will pass it to client. next will response successfully if we make request from browser to "/api/users/currentuser". whenever we try to make a request and we do not specify the domain, by default your browser is going to assume you are trying to make a request to the the current domain. "ticketing.dev/api/users/currentUser"

//But when we make request on the server, inside getInitialProps, when we make request to "ticketing.dev", that request will be converted to "127.0.0.1:80", ingress-nginx config rules will assign to client, client will render Landing page. before rendering the page it will call the getInitialProps whick makes request to "/api/users/currentuser" without specifying a domain. that request will go through the Networking layer which is run by node-http. node-http browser works similar to browser. if you did not specify a domain, node-http layer is going to assume that you are trying to make request on your local machine. it will stich the localhost:80 to the request. Critical thing is we are running our app inisde a container. a container is essentially its own litte world. so when we try to make request to "127.0.0.1:80", this address inside that container not outside world. nothing is running on 127.0.0.1:80 inside that container. it was not redirected back to nginx-ingress

// we are going to use axios differently on the browser and the server. in solution2, if we make request on the server, we write the full path. "http://auth-srv/api/users/currentuser". this is not a good option, that implies our react client code, will know the exact service name for every things it is ewer want to reach out. in the future we could make request to different service so we gotta change the base url eveytime we make request to a different service.

//solution is to make request to ingress nginx. it already has set of relevant "rules". the challenge is what domain we are making request to. how do we somehow reach out to ingress nginx while we are inside of some pod{Clien-Pod}. we can very easily reach out to ingress nginx from our local machine by just making request to localhost:80 or as we set it up ticketing.dev. but how do we do that same kind of thing when we are already inside the cluster. we need to figure out how to make a request directly to ingress nginx when we are inside the cluster. another challenge is our current authentication mechanism works based upon cookies. we need to keep in mind, we have some requests coming into our next.js app and it includes a cookie, and some point in time we are going to make a follow up request from inside of next.js and that follow up request is probably going to have to include that cookie information . when we execute the fething rrequest for current user inside getInitialProps, we do not have the browser automatically manage that cookie or anything like that.

//  two pods communicate each other with ClusterIp service. if Client Pod wants to reach Auth POd, CLient Pod will reach to Auth CLusterIp service. "http://auth-srv". this rule works only when we access a service that is inside in the same namespace. Namespace exist in the world of k8s. All the different objects that we create are crated under a specific namespace. we use namespaces to organize different objects. right now we have been working under a namepace called "default".
// `kubectl get namespace`  // minikube start
// u will see ingress nginx namespace. this is where all ingress nginx stuffs work. so we want to communicate from "default" namespace to "ingress nginx" namespace. CROSS NAMESPACE COMMUNICATION
// `http://NAMEOFSERVICE.kube-system.svc.cluster.local`
// we now have to get the services inside the "ingress nginx" namespace. `kubectl get services` will get the services inside the default namespace.
// - `kubectl get services -n ingress-nginx`
// since the name of the external namepsace name will be ugly, we  could create external Name service. it just remaps the domain of a request. but we are not.
