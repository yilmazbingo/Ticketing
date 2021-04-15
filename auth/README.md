## Set up mongodb

Each service has its own database. In this app, I use mongodb which will be running inside a pod. We do not create pods directly, instead we make use of deployments. Deployment is going to create a pod for us and in order to communicate with this pod, we have to create a cluster Ip service to go along with it as well.

We create a deployment that creates a pod that is going to run MongoDb instance. If we delete or restart the pod running MongoDb, we will lose all of the data in it.

- First we created mongodb instance for auth service. "/infra/k8s/auth-mongo-depl.yaml"
  This mongodb is available inside kubernester cluster inside a pod. To connect to a pod, we have to go through the cluster IP service. Anytime we are trying to connect to a cluster IP service we are going to write the name of that cluster iP service for the domain of connection url.

  `mongodb://auth-mongodb-srv:27017`

- inside "infra/k8s/auth-depl.yaml" I set an environment variable for this connection string.

  - name: MONGO_URI
    value: "mongodb://auth-mongo-srv:27017/auth"
