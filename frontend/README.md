# frontend

# 始め方

vscodeでdevcontainerを新規作成する
typescriptを選択する

コンテナに入る

プロジェクトフォルダを作成
```
yarn create vite
```
✔ Project name: … {任意，例: react-app}
✔ Select a framework: › React
✔ Select a variant: › TypeScript

モジュールのインストール
```
cd react-app
npm install -g npm@latest
npm install
```

開発サーバーを実行
```
npm run dev
```


## 変更点
ホットリロードを有効にする＆実行ポートを指定
```vite.config.json
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true
    },
    port: 3000
  },
  preview: {
    port: 4173
  }
})
```

preview時にlocal以外からアクセスできるようにする
```package.json
"scripts": {
    ...
    "preview": "vite preview --host"
  }
```

# 運用時
運用時はdevcontainerではなく，直下のdockerfileからビルドしたコンテナを使う。

ビルド
```
docker build -t my-application/react-app .
```

実行
```
docker run -p 4173:4173 my-application/react-app
```

うまくいくと"http://localhost:4173"からアプリケーションにアクセスできる。


# RESTのモックサーバーを作る

flask-res-mock.jsonにレスポンスを記載する。
ここで，最初のキーはエンドポイントとして扱われる。

```
{
    "predict": [
        {
            "input": ...
            ...
        }
    ]
}
```

以下のコマンドでjsonサーバーを実行する
```
npm install -g json-server
json-server --watch flask-res-mock.json -p 5000
```

以下のようにデータを取得する。
```
curl http://localhost:5000/predict
```

