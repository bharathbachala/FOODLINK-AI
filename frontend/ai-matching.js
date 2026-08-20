function calculateMatch(donation, ngo) {

    let score = 0;

    // 1. Food compatibility - 40%
    if (ngo.foodTypes.includes(donation.foodType)) {
        score += 40;
    }

    // 2. Distance - 30%
    if (ngo.distance <= 5) {
        score += 30;
    } else if (ngo.distance <= 10) {
        score += 20;
    } else if (ngo.distance <= 20) {
        score += 10;
    }

    // 3. Capacity - 20%
    if (ngo.capacity >= donation.quantity) {
        score += 20;
    } else if (ngo.capacity >= donation.quantity * 0.5) {
        score += 10;
    }

    // 4. Urgency - 10%
    if (donation.urgency === "high") {
        score += 10;
    } else if (donation.urgency === "medium") {
        score += 5;
    }

    return score;
}


function findBestNGO(donation, ngos) {

    let bestNGO = null;
    let highestScore = -1;

    ngos.forEach(ngo => {

        const score = calculateMatch(donation, ngo);

        if (score > highestScore) {
            highestScore = score;

            bestNGO = {
                ...ngo,
                matchScore: score
            };
        }
    });

    return bestNGO;
}
const donation = {
    foodType: "Rice",
    quantity: 50,
    urgency: "high"
};

const ngos = [
    {
        name: "Helping Hands",
        distance: 3,
        capacity: 100,
        foodTypes: ["Rice", "Wheat"]
    },
    {
        name: "Food For All",
        distance: 8,
        capacity: 30,
        foodTypes: ["Rice"]
    }
];

const result = findBestNGO(donation, ngos);

console.log("Best NGO:", result.name);
console.log("Match Score:", result.matchScore + "%");