# kurbenetes

## nginxを用いた動作チェック

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


## flask, mongodbを用いた機械学習推論アプリ

imageをビルドする
```
docker build -t my-application/react-app:0.0.1 ./frontend/
docker build -t my-application/flask-app:0.0.1 ./flask-app/
```

minikubeのdockerレジストリにimageをプッシュする
```
minikube image load my-application/react-app:0.0.1
minikube image load my-application/flask-app:0.0.1
```

デプロイ
```
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/flask-app-deployment.yaml,k8s/mongodb-deployment.yaml
```

Podが起動したか確認する
```
kubectl get pod -A
```

サービスを確認
```
minikube service list
```

リクエストを投げてみる
うまくいくと予測結果が返る
```
curl http://192.168.49.2:30050/predict -H "Content-Type: application/json" -d '{"input": [10.0]}' 
```

namespaceごと削除する
```
kubectl delete namespaces web-flask-api 
```


トラブルシューティング
```
# Podのログを確認する
kubectl logs {Pod名} -n web-flask-api

# Podにアタッチする
kubectl exec -it {Pod名} -n web-flask-api -- /bin/bash
```