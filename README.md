# kurbenetes

## nginx

```
minikube start
kubectl apply -f pod-nginx.yaml
```

docker in docker の場合，localhost:8080ではアクセスできない。
上記のようにminikube上で実行中のサービスを調べて，URLにアクセスする。
```
minikube service list
|-------------|---------------|--------------|---------------------------|
|  NAMESPACE  |     NAME      | TARGET PORT  |            URL            |
|-------------|---------------|--------------|---------------------------|
| default     | kubernetes    | No node port |                           |
| default     | nginx-service |         8080 | http://192.168.49.2:30080 |
| kube-system | kube-dns      | No node port |                           |
|-------------|---------------|--------------|---------------------------|
```

通信確認
```
curl http://192.168.49.2:30080 
```

デプロイメントとサービスを削除する
```
kubectl delete -f pod-nginx.yaml
```


## reactアプリ

frontendのimageをビルドする
```
cd frontend
docker build -t my-application/react-app .
docker tag my-application/react-app my-application/react-app:0.0.1
cd ..
```

minikubeのdockerレジストリにimageをプッシュする
```
minikube image load my-application/react-app:0.0.1
```

Pod，Serviceをデプロイ
```
kubectl delete -f pod-reactapp.yaml
```

サービスを確認
```
minikube service list
```

導通確認
```
curl http://192.168.49.2:30080 
```