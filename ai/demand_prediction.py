def predict_demand(previous_demand, growth_rate):
    demand = previous_demand * (1 + growth_rate)
    return round(demand)

print(predict_demand(100, 0.20))
