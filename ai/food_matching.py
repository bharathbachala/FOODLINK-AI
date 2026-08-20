def match_food(food_quantity, ngo_demand, distance):
    if ngo_demand >= food_quantity and distance <= 5:
        return "Best Match"

    elif ngo_demand > 0 and distance <= 10:
        return "Possible Match"

    else:
        return "Not Suitable"


# Example
food_quantity = 50
ngo_demand = 60
distance = 3

result = match_food(food_quantity, ngo_demand, distance)

print("Food Quantity:", food_quantity)
print("NGO Demand:", ngo_demand)
print("Distance:", distance, "km")
print("Matching Result:", result)
