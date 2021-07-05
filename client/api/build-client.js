// import axios from "axios";
// //  in incoming request we care about headers

// const baseUrl =
//   process.env.NODE_ENV === "development"
//     ? // const baseUrl = (process.env["NODE_ENV"] = "development"
//       "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
//     : "http://www.ticketing-bingology.xyz/";

// const buildClient = ({ req }) => {
//   // on server we need to access to headers
//   if (typeof window === "undefined") {
//     return axios.create({
//       // kubectl get namespaces ==> ingress-nginx
//       //kubectl get services -n ingress-nginx ==> ingress-nginx-controller
//       // we have to speocify the domain. ingress-nginx will not assume that we want to use the only domain inside the rules

//       baseURL: baseUrl,

//       headers: req.headers,
//     });
//   } else {
//     // in browser, browser takes care of the headers
//     return axios.create({
//       baseURL: "/",
//     });
//   }
// };
// export default buildClient;

import axios from "axios";
//  in incoming requests we care about headers

export default ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      // kubectl get namespaces ==> ingress-nginx
      //kubectl get services -n ingress-nginx ==> ingress-nginx-controller
      // we have to specify the domain. ingress-nginx will not assume that we want to use the only domain inside the rules

    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
