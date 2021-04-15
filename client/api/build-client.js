import axios from "axios";
const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      // kubectl get namespaces ==> ingress-nginx
      //kubectl get services -n ingress-nginx ==> ingress-nginx-controller
      // we have to speocify the domain. ingress-nginx will not assume that we want to use the only domain inside the rules.

      baseURL: "http://ingress-nginx-controller.kube-system.svc.cluster.local",
      // baseURL:
      //   "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};
export default buildClient;
