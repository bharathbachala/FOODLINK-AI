// ======================================================
// FOODLINK + FOODPULSE AI
// MAIN FRONTEND SCRIPT
// ======================================================

const API_URL = "http://localhost:5000/api";


// ======================================================
// API HELPER
// ======================================================

async function apiRequest(
    endpoint,
    options = {}
) {

    try {

        const response = await fetch(
            API_URL + endpoint,
            {
                headers: {
                    "Content-Type":
                        "application/json"
                },
                ...options
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "API request failed"
            );

        }


        return data;

    }

    catch (error) {

        console.error(
            "FoodLink API Error:",
            error
        );


        showNotification(
            "⚠️ Backend connection failed"
        );


        return null;

    }

}


// ======================================================
// NOTIFICATION
// ======================================================

function showNotification(
    message
) {

    const old =
        document.querySelector(
            ".foodlink-notification"
        );


    if (old) {

        old.remove();

    }


    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        "foodlink-notification";


    notification.textContent =
        message;


    notification.style.position =
        "fixed";

    notification.style.right =
        "25px";

    notification.style.bottom =
        "25px";

    notification.style.zIndex =
        "999999";

    notification.style.background =
        "#294f38";

    notification.style.color =
        "white";

    notification.style.padding =
        "14px 20px";

    notification.style.borderRadius =
        "12px";

    notification.style.fontSize =
        "13px";

    notification.style.fontWeight =
        "600";

    notification.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.18)";


    document.body.appendChild(
        notification
    );


    setTimeout(
        () => {

            notification.remove();

        },
        3500
    );

}


// Make available to inline HTML scripts

window.showNotification =
    showNotification;


// ======================================================
// BACKEND CONNECTION TEST
// ======================================================

async function checkBackend() {

    const result =
        await apiRequest(
            "/health"
        );


    if (result) {

        console.log(
            "✅ FoodLink backend connected"
        );

        console.log(
            "🤖 FoodPulse:",
            result.foodPulse
        );

        return true;

    }


    console.log(
        "❌ Backend unavailable"
    );

    return false;

}


// ======================================================
// GET ALL FOOD
// ======================================================

async function getFoods() {

    const result =
        await apiRequest(
            "/foods"
        );


    if (!result) {

        return [];

    }


    return result.foods || [];

}


// ======================================================
// GET FOODPULSE AI ANALYSIS
// ======================================================

async function getAIAnalysis() {

    const result =
        await apiRequest(
            "/ai/analyze"
        );


    if (!result) {

        return [];

    }


    console.log(
        "🤖 FoodPulse AI Analysis:",
        result
    );


    return result.foods || [];

}


// ======================================================
// ADD FOOD
// ======================================================

async function addFood(
    foodData
) {

    const result =
        await apiRequest(
            "/foods",
            {
                method: "POST",

                body:
                    JSON.stringify(
                        foodData
                    )
            }
        );


    if (!result) {

        return null;

    }


    showNotification(
        "🌾 Food successfully added"
    );


    console.log(
        "New food:",
        result.food
    );


    return result.food;

}


// ======================================================
// NGO MATCH
// ======================================================

async function getNGOMatch(
    foodId
) {

    const result =
        await apiRequest(
            `/ngo/match/${foodId}`
        );


    if (!result) {

        return null;

    }


    console.log(
        "❤️ NGO Match:",
        result
    );


    return result;

}


// ======================================================
// ACCEPT NGO DONATION
// ======================================================

async function acceptDonation(
    foodId,
    ngoName
) {

    const result =
        await apiRequest(
            "/donations",
            {
                method: "POST",

                body:
                    JSON.stringify({

                        foodId:
                            foodId,

                        ngoName:
                            ngoName

                    })
            }
        );


    if (!result) {

        return null;

    }


    showNotification(
        "❤️ NGO accepted the donation"
    );


    return result.donation;

}


// ======================================================
// CREATE VOLUNTEER TASK
// ======================================================

async function createVolunteerTask(
    foodId,
    volunteerId
) {

    const result =
        await apiRequest(
            "/volunteer/tasks",
            {
                method: "POST",

                body:
                    JSON.stringify({

                        foodId:
                            foodId,

                        volunteerId:
                            volunteerId

                    })
            }
        );


    if (!result) {

        return null;

    }


    showNotification(
        "🚚 Volunteer task created"
    );


    return result.task;

}


// ======================================================
// TRACKING
// ======================================================

async function getTracking(
    foodId
) {

    const result =
        await apiRequest(
            `/tracking/${foodId}`
        );


    if (!result) {

        return null;

    }


    console.log(
        "🚚 Tracking:",
        result.tracking
    );


    return result.tracking;

}


// ======================================================
// ANALYTICS
// ======================================================

async function getAnalytics() {

    const result =
        await apiRequest(
            "/analytics"
        );


    if (!result) {

        return null;

    }


    console.log(
        "📊 Analytics:",
        result.analytics
    );


    return result.analytics;

}


// ======================================================
// PURCHASE FOOD
// ======================================================

async function purchaseFood(
    foodId,
    quantity
) {

    const result =
        await apiRequest(
            "/orders",
            {
                method: "POST",

                body:
                    JSON.stringify({

                        foodId:
                            foodId,

                        quantity:
                            quantity

                    })
            }
        );


    if (!result) {

        return null;

    }


    showNotification(
        "🛒 Food purchase successful"
    );


    return result.order;

}


// ======================================================
// DASHBOARD FOOD LOADER
// ======================================================

async function loadDashboardFood() {

    const foods =
        await getFoods();


    console.log(
        "📦 Dashboard foods:",
        foods
    );


    return foods;

}


// ======================================================
// MARKETPLACE LOADER
// ======================================================

async function loadMarketplace() {

    const foods =
        await getFoods();


    const available =
        foods.filter(
            food =>
                food.status ===
                "available"
        );


    console.log(
        "🏪 Marketplace:",
        available
    );


    return available;

}


// ======================================================
// AI PAGE LOADER
// ======================================================

async function loadAIPage() {

    const foods =
        await getAIAnalysis();


    console.log(
        "🤖 AI page data:",
        foods
    );


    return foods;

}


// ======================================================
// NGO PAGE LOADER
// ======================================================

async function loadNGOPage() {

    const foods =
        await getFoods();


    const urgent =
        foods.filter(
            food =>
                food.risk >= 75 &&
                food.status ===
                "available"
        );


    console.log(
        "❤️ NGO urgent food:",
        urgent
    );


    return urgent;

}


// ======================================================
// VOLUNTEER PAGE LOADER
// ======================================================

async function loadVolunteerTasks() {

    const foods =
        await getFoods();


    const tasks =
        foods.filter(
            food =>
                food.risk >= 75
        );


    console.log(
        "🙋 Volunteer tasks:",
        tasks
    );


    return tasks;

}


// ======================================================
// TRACKING PAGE LOADER
// ======================================================

async function loadTracking(
    foodId = 2
) {

    const tracking =
        await getTracking(
            foodId
        );


    if (tracking) {

        console.log(
            "📍 Current tracking:",
            tracking
        );

    }


    return tracking;

}


// ======================================================
// ANALYTICS PAGE LOADER
// ======================================================

async function loadAnalytics() {

    const analytics =
        await getAnalytics();


    if (analytics) {

        console.log(
            "📊 Current analytics:",
            analytics
        );

    }


    return analytics;

}


// ======================================================
// AUTO DETECT PAGE
// ======================================================

function getCurrentPage() {

    const file =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    return file;

}


// ======================================================
// PAGE INITIALIZATION
// ======================================================

async function initializeFoodLink() {

    console.log(
        "🌱 FoodLink + FoodPulse AI loaded"
    );


    const connected =
        await checkBackend();


    if (!connected) {

        console.warn(
            "Backend is not running."
        );

        return;

    }


    const page =
        getCurrentPage();


    console.log(
        "📄 Current page:",
        page
    );


    switch (page) {

        case "index.html":

            await loadDashboardFood();

            break;


        case "marketplace.html":

            await loadMarketplace();

            break;


        case "ai.html":

            await loadAIPage();

            break;


        case "ngo.html":

            await loadNGOPage();

            break;


        case "volunteer.html":

            await loadVolunteerTasks();

            break;


        case "tracking.html":

            await loadTracking();

            break;


        case "analytics.html":

            await loadAnalytics();

            break;


        default:

            console.log(
                "No special loader for this page."
            );

    }

}


// ======================================================
// GLOBAL FUNCTIONS
// ======================================================

window.apiRequest =
    apiRequest;

window.getFoods =
    getFoods;

window.getAIAnalysis =
    getAIAnalysis;

window.addFood =
    addFood;

window.getNGOMatch =
    getNGOMatch;

window.acceptDonation =
    acceptDonation;

window.createVolunteerTask =
    createVolunteerTask;

window.getTracking =
    getTracking;

window.getAnalytics =
    getAnalytics;

window.purchaseFood =
    purchaseFood;

window.loadMarketplace =
    loadMarketplace;

window.loadAIPage =
    loadAIPage;

window.loadNGOPage =
    loadNGOPage;

window.loadVolunteerTasks =
    loadVolunteerTasks;

window.loadTracking =
    loadTracking;

window.loadAnalytics =
    loadAnalytics;


// ======================================================
// START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeFoodLink
);