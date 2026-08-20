from flask import Flask, request, jsonify

from food_matching import match_food
from priority import calculate_priority
from rescue_engine import rescue_decision

app = Flask(__name__)


@app.route("/ai/match", methods=["POST"])
def ai_match():

    data = request.get_json()

    food_quantity = data.get("foodQuantity")
    expiry_days = data.get("expiryDays")
    ngo_demand = data.get("ngoDemand")
    distance = data.get("distance")

    if (
        food_quantity is None
        or expiry_days is None
        or ngo_demand is None
        or distance is None
    ):
        return jsonify({
            "success": False,
            "message": "All four values are required"
        }), 400

    match_result = match_food(
        food_quantity,
        ngo_demand,
        distance
    )

    priority_result = calculate_priority(
        food_quantity,
        expiry_days,
        ngo_demand
    )

    rescue_result = rescue_decision(
        food_quantity,
        expiry_days,
        ngo_demand,
        distance
    )

    return jsonify({
        "success": True,
        "input": {
            "foodQuantity": food_quantity,
            "expiryDays": expiry_days,
            "ngoDemand": ngo_demand,
            "distance": distance
        },
        "ai": {
            "match": match_result,
            "priority": priority_result,
            "rescueDecision": rescue_result
        }
    })


if __name__ == "__main__":
    app.run(port=5001, debug=True)
