def predict_waste(prepared_food, expected_demand):
    waste = prepared_food - expected_demand

    if waste < 0:
        waste = 0

    return waste


# Example
prepared_food = 200
expected_demand = 150

waste = predict_waste(prepared_food, expected_demand)

print("Prepared Food:", prepared_food)
print("Expected Demand:", expected_demand)
print("Predicted Surplus/Waste:", waste)
