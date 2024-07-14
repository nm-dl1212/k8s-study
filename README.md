# kurbenetes
起動
```
minikube start
```


## nginxを用いた動作チェック
```
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

imageレジストリをminikubeVM上のDockerに設定する。
(以下コマンドで，環境変数DOCKER_TLS_VERIFY, DOCKER_HOST, DOCKER_CERT_PATH, DOCKER_API_VERSIONを書き換える。)
```
eval $(minikube docker-env)
```

imageをビルドする
```
docker build -t my-application/frontend:0.0.1 ./frontend/
docker build -t my-application/flask-app:0.0.1 ./flask-app/
```

デプロイ
```
kubectl apply -f k8s/namespace.yaml,k8s/frontend-deployment.yaml,k8s/flask-app-deployment.yaml,k8s/mongodb-deployment.yaml
```

Podが起動したか確認する
```
kubectl get pod -A
```

## ローカル端末（windows側）からアプリにリクエストする
以下で，frontendのサービスをローカルの30000番ポートに転送する。
```
kubectl port-forward svc/frontend-service 30000:4173 -n web-flask-api 
```

ローカルのブラウザで`localhost:30000`にアクセスすると，フロントエンドの画面が表示される。
(devcontainerを使っている場合は，`devcontainer.json`で`"forwardPorts": [30000]`としておく。)


もう一つのパターンとして，フロントエンドを介さずに直接アプリサーバーにアクセスるる。
同様の手順で，フロントエンドのサービスをローカルの30000番ポートに転送する。
```
kubectl port-forward svc/flask-app-service 30000:5000 -n web-flask-api 
```

以下のようなコマンドを投げると，予測結果を得ることができる。
```
curl http://localhost:30000/predict -H "Content-Type: application/json" -d '{"input": [10.0]}'
```


# その他
## トラブルシューティング
```
# Podのログを確認する
kubectl logs {Pod名} -n web-flask-api

# Podにアタッチする
kubectl exec -it {Pod名} -n web-flask-api -- /bin/bash
```

## 終了時
namespaceごと削除する
```
kubectl delete namespaces web-flask-api 
```