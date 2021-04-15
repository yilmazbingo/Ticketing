-$   minikube dashboard

- manuallly isntalling image
  `docker build -t kalinicovic/client .`
- next.js in docker hot module might not be working properly
  - next.config.js add configuration.

## set up bootstrap

- create \_app.js in next.js
## authentication
- our client makes request to auth service. the question is when we are going to make this request. we want our first send html file immediately tells us if the user signed in or not. we need to figure out how to make request while our application built or served from next.js server. 
- whenever we sent a req to next.js, it will determine which components to show up. this is similar how I set up on ReactSSr app. StaticRouter will decide. then it  will call those components's `getInitialProps` static method. 
- `getInitialProps` will be called while next.js is attempting to render our application on the server. getIntialsProps is our opportunity to attend to fetch some data that this component needs during ssr process. 
- each component will be rendered with the data from "getInitialProps' one time. this data will be provided to our component as prop. 
- we cannot do any data loading inside of components themselves. when we render a component with next.js during ssr phase, we dont get any opportunity to make requests . all of our components are executed or rendered just one single time. 

## Configuration to add ingress-nginx Servicename and NameSpace
  we are going to make our request to ingress-nginx and it will route the requests. here are the steps
- minikube addons enable ingress
- run `minikube ip` and add this to "/etc/hosts"

