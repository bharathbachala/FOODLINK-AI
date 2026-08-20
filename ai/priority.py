def calculate_priority(food_quantity, expiry_days, ngo_demand):
    score = 0

    if expiry_days <= 1:
        score += 50
    elif expiry_days <= 3:
        score += 30
    else:
        score += 10

    if ngo_demand >= food_quantity:
        score += 40
    elif ngo_demand > 0:
        score += 20

    if food_quantity >= 50:
        score += 10

    if score >= 80:
        return "High Priority"
    elif score >= 50:
        return "Medium Priority"
    else:
        return "Low Priority"


# Example
food_quantity = 50
expiry_days = 1
ngo_demand = 60

priority = calculate_priority(
    food_quantity,
    expiry_days,
    ngo_demand
)

print("Food Quantity:", food_quantity)
print("Expiry Days:", expiry_days)
print("NGO Demand:", ngo_demand)
print("Priority:", priority)
