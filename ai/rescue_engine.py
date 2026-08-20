def rescue_decision(food_quantity, expiry_days, ngo_demand, distance):
    # High-risk food: rescue immediately
    if expiry_days <= 1:
        if ngo_demand >= food_quantity and distance <= 10:
            return "URGENT DONATION"
        elif distance <= 10:
            return "URGENT REDISTRIBUTION"
        else:
            return "URGENT ACTION"

    # Medium-risk food
    elif expiry_days <= 3:
        if ngo_demand >= food_quantity and distance <= 10:
            return "DONATE"
        elif distance <= 10:
            return "REDISTRIBUTE"
        else:
            return "SELL WITH DISCOUNT"

    # Low-risk food
    else:
        if ngo_demand > 0 and distance <= 10:
            return "NORMAL REDISTRIBUTION"
        else:
            return "NORMAL SALE"


# Example
food_quantity = 50
expiry_days = 1
ngo_demand = 60
distance = 5

decision = rescue_decision(
    food_quantity,
    expiry_days,
    ngo_demand,
    distance
)

print("Food Quantity:", food_quantity)
print("Expiry Days:", expiry_days)
print("NGO Demand:", ngo_demand)
print("Distance:", distance, "km")
print("Rescue Decision:", decision)
