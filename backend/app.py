from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

FORTUNES = [
    "雲層散開，柔光指引你前行，心念所向即有回聲。",
    "如羽般輕盈的日子正靠近，記得放慢呼吸，接住溫柔的機會。",
    "花影搖曳，你的步伐帶著微光，願意嘗試的小事會帶來驚喜。",
    "微風拂過心湖，答案在細碎波紋裡，靜心聆聽便能感受。",
    "月色如水，柔柔地照亮你的選擇，信任直覺，它不會背叛你。",
    "星光低語，今天的勇氣會種下一顆溫柔的種子。",
    "霧氣微散，新的念頭像光點一樣閃現，試著記下它們。",
    "晨露閃爍在葉尖，提醒你：小小的改變也會帶來暖意。",
    "淡紫色的希望在你面前展開，跟隨它一步一步走近。",
    "在柔和的光中，給自己一個微笑，答案會悄悄來到你身邊。"
]

@app.route('/api/fortune', methods=['GET'])
def fortune():
    question = request.args.get('question', '').strip()
    # 目前不需要利用 question 做複雜組合，但保留給未來擴充
    chosen = random.choice(FORTUNES)
    return jsonify({"fortune": chosen})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
