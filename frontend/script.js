// ==========================================
// FOODLINK AI - MAIN JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("FoodLink AI Dashboard Loaded");


    // ==========================================
    // NAVIGATION
    // ==========================================

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            this.classList.add("active");

        });

    });


    // ==========================================
    // AI PREDICTION DEMO
    // ==========================================

    const aiButton = document.querySelector(".primary-button");

    if (aiButton) {

        aiButton.addEventListener("click", function () {

            console.log("Opening AI Prediction...");

        });

    }


    // ==========================================
    // FOOD RISK DATA
    // ==========================================

    const foodRiskData = [
        {
            name: "Tomatoes",
            quantity: "100 KG",
            shelfLife: "3 days",
            risk: 87,
            level: "High"
        },

        {
            name: "Bananas",
            quantity: "75 KG",
            shelfLife: "2 days",
            risk: 73,
            level: "High"
        },

        {
            name: "Potatoes",
            quantity: "150 KG",
            shelfLife: "7 days",
            risk: 42,
            level: "Medium"
        },

        {
            name: "Rice",
            quantity: "300 KG",
            shelfLife: "30 days",
            risk: 15,
            level: "Low"
        }
    ];


    // ==========================================
    // DASHBOARD STATISTICS
    // ==========================================

    let foodSaved = 1250;
    let wasteReduced = 980;
    let activeListings = 42;
    let foodAtRisk = 17;


    function updateDashboard() {

        console.log("Dashboard Statistics");

        console.log("Food Saved:", foodSaved + " KG");

        console.log("Waste Reduced:", wasteReduced + " KG");

        console.log("Active Listings:", activeListings);

        console.log("Food At Risk:", foodAtRisk);

    }

    updateDashboard();


    // ==========================================
    // FOOD RISK ANALYSIS
    // ==========================================

    function getRiskLevel(risk) {

        if (risk >= 70) {
            return "HIGH";
        }

        if (risk >= 40) {
            return "MEDIUM";
        }

        return "LOW";

    }


    foodRiskData.forEach(function (food) {

        console.log(
            food.name +
            " → " +
            food.risk +
            "% → " +
            getRiskLevel(food.risk)
        );

    });


    // ==========================================
    // QUICK ACTION BUTTONS
    // ==========================================

    const actionButtons =
        document.querySelectorAll(".action-button");

    actionButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log(
                "Opening:",
                this.innerText.trim()
            );

        });

    });


    // ==========================================
    // AI RECOMMENDATION
    // ==========================================

    function generateRecommendation(food) {

        if (food.risk >= 80) {

            return {
                action: "Immediate Action Required",
                discount: "30%",
                restaurant: "40 KG",
                donation: "20 KG"
            };

        }

        if (food.risk >= 50) {

            return {
                action: "Action Recommended",
                discount: "20%",
                restaurant: "20 KG",
                donation: "10 KG"
            };

        }

        return {
            action: "Normal Monitoring",
            discount: "10%",
            restaurant: "Optional",
            donation: "Optional"
        };

    }


    const tomatoRecommendation =
        generateRecommendation(foodRiskData[0]);

    console.log(
        "Tomato AI Recommendation:",
        tomatoRecommendation
    );


    // ==========================================
    // LIVE TIME
    // ==========================================

    function updateTime() {

        const now = new Date();

        const time =
            now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

        console.log("Current Time:", time);

    }

    updateTime();


    // ==========================================
    // DEMO NOTIFICATION
    // ==========================================

    function showNotification(message) {

        const notification =
            document.createElement("div");

        notification.innerText = message;

        notification.style.position = "fixed";
        notification.style.bottom = "25px";
        notification.style.right = "25px";

        notification.style.background = "#176b43";
        notification.style.color = "white";

        notification.style.padding = "14px 20px";

        notification.style.borderRadius = "10px";

        notification.style.fontSize = "13px";

        notification.style.zIndex = "9999";

        document.body.appendChild(notification);


        setTimeout(function () {

            notification.remove();

        }, 3000);

    }


    // ==========================================
    // AI STATUS
    // ==========================================

    setTimeout(function () {

        showNotification(
            "🌱 FoodLink AI is ready"
        );

    }, 1000);


});

const foodForm = document.getElementById("foodForm");

if (foodForm) {

    foodForm.addEventListener("submit", function (event) {

        // Stop page from refreshing
        event.preventDefault();

        // ==========================================
        // GET FORM VALUES
        // ==========================================

        const foodName =
            document.getElementById("foodName").value.trim();

        const category =
            document.getElementById("category").value;

        const quantity =
            Number(document.getElementById("quantity").value);

        const price =
            Number(document.getElementById("price").value);

        const shelfLife =
            Number(document.getElementById("shelfLife").value);

        const location =
            document.getElementById("location").value.trim();

        const description =
            document.getElementById("description").value.trim();


        // ==========================================
        // BASIC VALIDATION
        // ==========================================

        if (
            !foodName ||
            !category ||
            !quantity ||
            price < 0 ||
            !shelfLife ||
            !location
        ) {

            showNotification(
                "⚠️ Please fill all required fields."
            );

            return;
        }


        // ==========================================
        // DEMO AI WASTE RISK
        // ==========================================

        let wasteRisk = 20;

        /*
         * This is a DEMO calculation.
         * Later, your AI teammate will replace
         * this with the real prediction model.
         */

        if (shelfLife <= 2) {
            wasteRisk += 45;
        }
        else if (shelfLife <= 4) {
            wasteRisk += 30;
        }
        else if (shelfLife <= 7) {
            wasteRisk += 15;
        }


        if (quantity >= 100) {
            wasteRisk += 15;
        }
        else if (quantity >= 50) {
            wasteRisk += 8;
        }


        // Keep risk between 0 and 99
        wasteRisk = Math.min(wasteRisk, 99);


        // ==========================================
        // DETERMINE RISK LEVEL
        // ==========================================

        let riskLevel;

        if (wasteRisk >= 70) {
            riskLevel = "HIGH";
        }
        else if (wasteRisk >= 40) {
            riskLevel = "MEDIUM";
        }
        else {
            riskLevel = "LOW";
        }


        // ==========================================
        // AI RECOMMENDATION
        // ==========================================

        let recommendation;

        if (wasteRisk >= 70) {

            recommendation =
                "Immediate action recommended. " +
                "Consider a 30% discount or donation.";

        }
        else if (wasteRisk >= 40) {

            recommendation =
                "Monitor demand and consider a 20% discount.";

        }
        else {

            recommendation =
                "Food is currently at low waste risk.";

        }


        // ==========================================
        // CREATE FOOD OBJECT
        // ==========================================

        const foodListing = {

            id: Date.now(),

            foodName: foodName,

            category: category,

            quantity: quantity,

            price: price,

            shelfLife: shelfLife,

            location: location,

            description: description,

            wasteRisk: wasteRisk,

            riskLevel: riskLevel,

            recommendation: recommendation

        };


        // ==========================================
        // SAVE TO LOCAL STORAGE
        // ==========================================

        let listings =
            JSON.parse(
                localStorage.getItem("foodlinkListings")
            ) || [];

        listings.push(foodListing);

        localStorage.setItem(
            "foodlinkListings",
            JSON.stringify(listings)
        );


        // ==========================================
        // SHOW RESULT
        // ==========================================

        showFoodListingResult(foodListing);


        // ==========================================
        // SUCCESS MESSAGE
        // ==========================================

        showNotification(
            "🌱 Food listing added successfully!"
        );


        // ==========================================
        // RESET FORM
        // ==========================================

        foodForm.reset();

    });

}


// ==========================================
// SHOW FOOD LISTING RESULT
// ==========================================

function showFoodListingResult(food) {

    // Remove old result if it exists
    const oldResult =
        document.getElementById("foodListingResult");

    if (oldResult) {
        oldResult.remove();
    }


    // Create result box
    const result =
        document.createElement("div");

    result.id = "foodListingResult";

    result.style.marginTop = "20px";

    result.style.padding = "18px";

    result.style.borderRadius = "12px";

    result.style.background = "#f1f9f4";

    result.style.border =
        "1px solid #cfe8d8";


    result.innerHTML = `

        <h3 style="
            color:#176b43;
            margin-bottom:12px;
            font-size:16px;
        ">
            🤖 FoodLink AI Analysis
        </h3>

        <div style="
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:10px;
            margin-bottom:15px;
        ">

            <div style="
                background:white;
                padding:12px;
                border-radius:8px;
            ">
                <small>Food</small>
                <strong style="display:block;">
                    ${food.foodName}
                </strong>
            </div>

            <div style="
                background:white;
                padding:12px;
                border-radius:8px;
            ">
                <small>Quantity</small>
                <strong style="display:block;">
                    ${food.quantity} KG
                </strong>
            </div>

            <div style="
                background:white;
                padding:12px;
                border-radius:8px;
            ">
                <small>Location</small>
                <strong style="display:block;">
                    ${food.location}
                </strong>
            </div>

        </div>


        <div style="
            background:white;
            padding:15px;
            border-radius:8px;
            margin-bottom:12px;
        ">

            <small>Estimated Waste Risk</small>

            <div style="
                display:flex;
                align-items:center;
                gap:12px;
                margin-top:6px;
            ">

                <div style="
                    flex:1;
                    height:9px;
                    background:#e5ebe7;
                    border-radius:10px;
                    overflow:hidden;
                ">

                    <div style="
                        width:${food.wasteRisk}%;
                        height:100%;
                        background:${
                            food.wasteRisk >= 70
                            ? "#dc4b4b"
                            : food.wasteRisk >= 40
                            ? "#d28a28"
                            : "#29935b"
                        };
                    "></div>

                </div>

                <strong>
                    ${food.wasteRisk}%
                </strong>

            </div>

            <small style="
                display:block;
                margin-top:5px;
            ">
                Risk Level: ${food.riskLevel}
            </small>

        </div>


        <div style="
            background:white;
            padding:15px;
            border-radius:8px;
        ">

            <strong>
                💡 AI Recommendation
            </strong>

            <p style="
                margin-top:6px;
                font-size:12px;
                color:#59645e;
            ">
                ${food.recommendation}
            </p>

        </div>

    `;


    // Add result after form
    foodForm.parentElement.appendChild(result);

}


// ==========================================
// SHOW NOTIFICATION
// ==========================================

function showNotification(message) {

    // Remove existing notification
    const existing =
        document.querySelector(".foodlink-notification");

    if (existing) {
        existing.remove();
    }


    const notification =
        document.createElement("div");

    notification.className =
        "foodlink-notification";

    notification.innerText = message;


    notification.style.position = "fixed";

    notification.style.bottom = "25px";

    notification.style.right = "25px";

    notification.style.background = "#176b43";

    notification.style.color = "white";

    notification.style.padding =
        "14px 20px";

    notification.style.borderRadius =
        "10px";

    notification.style.fontSize =
        "13px";

    notification.style.fontWeight =
        "600";

    notification.style.boxShadow =
        "0 8px 20px rgba(0,0,0,0.15)";

    notification.style.zIndex =
        "9999";


    document.body.appendChild(notification);


    setTimeout(function () {

        notification.remove();

    }, 3000);

}