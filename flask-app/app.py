from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import uuid
import datetime
from pymongo import MongoClient, errors

app = Flask(__name__)
CORS(app)

#環境変数
MONGO_URI = os.environ.get("MONGO_URI")

# MongoDBの設定
try:
    client = MongoClient(MONGO_URI)
    db = client["prediction_db"]
    collection = db["predictions"]
    client.admin.command('ping')  # 接続テスト
    print(f"Successfully connected to MongoDB !!!")
except errors.ConnectionFailure as e:
    print(f"Could not connect to MongoDB: {e}")


# scikit-learnモデルをロード
model = joblib.load("model.joblib")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    # 入力データをscikit-learnの形式に変換
    input_data = [data["input"]]

    # モデルによる予測
    prediction = model.predict(input_data)

    # 結果の作成
    result = {
        "uuid": str(uuid.uuid4()),
        "timestamp": datetime.datetime.now().isoformat(),
        "input": input_data,
        "prediction": prediction.tolist(),
    }
    print(result)

    # 結果をMongoDBに保存
    try:
        # 結果をMongoDBに保存
        collection.insert_one(result)
    except errors.PyMongoError as e:
        print(f"Could not insert into MongoDB: {e}")
        return jsonify({"error": "Could not save prediction to database"}), 500
    
    # returnする前に"_id"を削除しておく。
    # mongodbの"_id"をjsonに変換できないため。
    del result["_id"]
    return jsonify(result)


@app.route("/health", methods=["GET"])
def health():
    return "this is HEALTY flask-app server. Please request me via axios !"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
