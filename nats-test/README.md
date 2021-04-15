## Run the program

To access Nats inside kubernetes, you need forward ports

```
kubectl get pods
k port-forward nats-depl-5c476d944c-jd4t4 4222:4222
```


