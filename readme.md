## Structure of App

There are 4 types of resources: User, Ticket, Order and Charge and 5 services to handle those resources.
-Auth Service: In charge of everything related to user signup/signin.
-Tickets Service: In charge of ticket creation and editing. It will know eveything about tickets.
-Orders Service: In charge of orcer creation and editing

- Expiration Service: Watches for orders to be created, cancels them after 15 minutes if user has not paid.
- Payment Service: Handles credit card payment
- Order Service : Order creation and editing

# DEVELOPMENT SETUP

## SET UP SECRET KEY FOR JWT

`kubectl create secret generic jwt-secret --from-literal=JWT_KEY==yourSecretKey`
`kubectl get secrets`

## SET UP DOCKER

**INSTALL DOCKER in debian**

```
kali@kali:~$ sudo apt update
kali@kali:~$ sudo apt install -y docker.io
kali@kali:~$ sudo systemctl enable docker --now
kali@kali:~$ docker
```

**INSTALL DOCKER-COMPOSE in Debian**

```
kali@kali:~$ sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
kali@kali:~$ sudo chmod +x /usr/local/bin/docker-compose
```

## SET UP KUBERNETES

- We use Docker to create the images and then pass those images to Kubernetes to create containers and maintain them.
- All K8s config files are in "infra/k8s" directory.
- for service config, I did not mention service type. Default is Cluster Ip

1- install minikube

```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
sudo dpkg -i minikube_latest_amd64.deb
```

2- start

`minikube start`

gives this error : No possible driver was detected.

3- set the driver

`sudo minikube start --driver=docker`

4- Add your user to the 'docker' group:

`sudo usermod -aG docker $USER && newgrp docker`

6- Install kubectl

```
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"

```

-Make the kubectl binary executable.

`chmod +x ./kubectl`

- Move the binary in to your PATH.

`sudo mv ./kubectl /usr/local/bin/kubectl`

- check the verison
  `kubectl version`

## Skaffold

- it is used in development environment. makes it easy to update the code.
- start minikube first. `minikube start`

  ```
  curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \
  sudo install skaffold /usr/local/bin/
  ```

- in root directory, create skaffold.yaml. skafofld runs outside of our cluster
  `skaffold dev`
  -if we start another projects we need to stop this scaffold process with `ctrl c`

## set up ingress-nginx

- Since I use minikube

  `minikube addons enable ingress`
  `minikube addons list`

- test the installation
  `kubectl get pods -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx`
- Write a config file in /k8
  `k apply -f ingress-srv.yaml` // You dont need this if you setup skaffold
- Inside config we have this setting: - host: ticketing.dev
  ingress will redirect to online ticketing.dev. To redirect the nginx to our local machine we need to tweak hosts file

## Configure the host file for ingress-nginx in linux

`code /etc/hosts`

- get the ip from minikube
  `minikube ip`
- add this ip to hosts file

  172.17.0.3 ticketing.dev

- Now in browser we are going to make request to "http://ticketing.dev"

## Your Connection is not private

nginx is a web server that is going to use a https connection. By default it uses self-signed certificate. chrome does not trust servers that use self signed certificates.
ingress server uses some configuration options that are going to prevent u from trying to circumvent the warning screen by clicking on advance tab. this error happens only in dev environment.

- Type "thisisunsafe" on the page anywhere on the screen

- In cryptography and computer security, a self-signed certificate is a security certificate that is not signed by a certificate authority (CA). These certificates are easy to make and do not cost money. However, they do not provide all of the security properties that certificates signed by a CA aim to provide.

## PORT FORWARDING

- this is strictly for development setting.
- we run a command and tell Kubernetes cluster to forward port of NATS Pod. That is going to cause our cluster to behave as though it has a node port service running inside of it.

fint the pod name of the nats:
`k get pods`-->
`k port-forward nats-depl-55c8b8f6c8-5mbw9 4222:4222`

## SET UP TEST ENVIRONMENT

Run the tests directly from the terminal using docker `npm run test` and "jest" will execute the test files. "Jest" will do the followings:

- Start in-memory copy of MongoDB
- Start up the express app
- Use supertest library to make fake requests to our express app
- Run assertions to make sure the request did the right thing.

  In order to supertest work we have to refactor our code: https://stackoverflow.com/questions/56122778/supertest-not-found-error-testing-express-endpoint/57368925#57368925

  `npm install --save-dev @types/jest @types/supertest jest ts-jest supertest mongodb-memory-server`

- `mongodb-memory-server` allows us easily test multiple databses at the same time. We want to run tests for different services concurrently on the same machine. It might be challenging if they all connect to the same instance of mongodb.
- in package.json, add this script
  `"test":"jest --watchAll --no-cache"`

  "--no-cache" is related to use typescript with jest. "Jest" does not have typescript support out of the box. Sometime "jest" gets confused understanding if file changed or not. After scrip add this to package.json

  ```json
   "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "setupFilesAfterEnv": [
      "./src/test/setup.ts"
    ]
  },
  ```

with "setupFilesAfterEnv" we are telling jest, run this file after everything initially set up.

"ts-jest" gives "jest" ability to understand typescript.

## abstract Class

- cannot be instantiated
- used to set up requirements for subclasses
- do create a class when translated to js which means we can use it in 'instanceof' checks. when we translate interface to js all interface fall away. they dont exist in world of javascript but abstract classes do. we will be using abstract class to avoid the "if err instanceof DatabaseConnectionError"

- type inference works if variable declaration and variable initialization are on the same line
  `const color=red`
  ````let numbers=[-10,-1,12]
    let numberAboveZero=false; ``` ts will infer that type is boolean. when we asign it to numbers[i], it will error
    iterate over, if number greater 0, numberABoveZero=numbers[i], if number is less than 0, numberAboveZero=0.
    to solver this we have to add type annotation:
    `let numberAboveZero:boolean | number =false`
  ````

## Mongodb

- if we delete or restart the pod running mongodb, we will lose all of the data in it.

## formatting json properties

we can overwrite how js turns an object into json. whenever we write `JSON.stringify(person)` javascript will invoke the method `toJSON()" method inside the obj. if we return 1, it ll be 1.
we use this to get a consistend db return values cause mognodb returns \_id. we are going to modify the resposne obj in the users model.
