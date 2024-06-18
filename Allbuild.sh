#!/bin/bash

# frontendのimageをビルドする
cd frontend
docker build -t my-application/react-app .
docker tag my-application/react-app my-application/react-app:0.0.1
cd ..

# minikubeのdockerレジストリにimageをプッシュする
minikube image load my-application/react-app:0.0.1

# Pod，Serviceをデプロイ
kubectl deploy -f pod-reactapp.yaml

# サービスを確認
minikube service list