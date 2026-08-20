// ============================================================
// FOODLINK AI + FOODPULSE BACKEND
// server.js
// ============================================================

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");


// ============================================================
// APP SETUP
// ============================================================

const app = express();

const PORT = 5000;


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ============================================================
// DATA FILE
// ============================================================

// Automatically supports either:
//
// backend/data/foods.json
//
// OR
//
// backend/foods.json
//
// If neither exists, it creates:
// backend/data/foods.json

const dataDirectory =
    path.join(__dirname, "data");

const dataFoodsFile =
    path.join(
        dataDirectory,
        "foods.json"
    );

const rootFoodsFile =
    path.join(
        __dirname,
        "foods.json"
    );


if (
    fs.existsSync(rootFoodsFile) &&
    !fs.existsSync(dataFoodsFile)
) {

    // Use existing foods.json if it already exists
    // in backend folder.

    console.log(
        "Using:",
        rootFoodsFile
    );

}
else {

    // Make data directory if necessary.

    if (
        !fs.existsSync(dataDirectory)
    ) {

        fs.mkdirSync(
            dataDirectory,
            {
                recursive: true
            }
        );

    }

}


// ============================================================
// GET FOOD FILE
// ============================================================

function getFoodFile() {

    if (
        fs.existsSync(rootFoodsFile) &&
        !fs.existsSync(dataFoodsFile)
    ) {

        return rootFoodsFile;

    }

    return dataFoodsFile;

}


// ============================================================
// READ FOODS
// ============================================================

function readFoods() {

    try {

        const file =
            getFoodFile();


        if (
            !fs.existsSync(file)
        ) {

            fs.writeFileSync(
                file,
                "[]",
                "utf8"
            );

            return [];

        }


        const data =
            fs.readFileSync(
                file,
                "utf8"
            );


        if (
            !data.trim()
        ) {

            return [];

        }


        const foods =
            JSON.parse(data);


        if (
            !Array.isArray(foods)
        ) {

            console.error(
                "foods.json is not an array."
            );

            return [];

        }


        return foods;

    }

    catch (error) {

        console.error(
            "Error reading foods:",
            error
        );

        return [];

    }

}


// ============================================================
// WRITE FOODS
// ============================================================

function writeFoods(
    foods
) {

    try {

        const file =
            getFoodFile();


        const directory =
            path.dirname(file);


        if (
            !fs.existsSync(directory)
        ) {

            fs.mkdirSync(
                directory,
                {
                    recursive: true
                }
            );

        }


        fs.writeFileSync(

            file,

            JSON.stringify(
                foods,
                null,
                2
            ),

            "utf8"

        );


        return true;

    }

    catch (error) {

        console.error(
            "Error writing foods:",
            error
        );

        return false;

    }

}


// ============================================================
// HOME / HEALTH CHECK
// ============================================================

app.get(
    "/",
    (req, res) => {

        res.json({

            success: true,

            message:
                "FoodLink + FoodPulse API is running",

            version:
                "1.0.0",

            status:
                "online"

        });

    }
);


// ============================================================
// API HEALTH
// ============================================================

app.get(
    "/api",
    (req, res) => {

        res.json({

            success: true,

            service:
                "FoodLink Backend",

            foodPulse:
                "active",

            status:
                "online",

            timestamp:
                new Date().toISOString()

        });

    }
);


// ============================================================
// GET ALL FOODS
// ============================================================
//
// This endpoint returns everything.
//
// GET /api/foods/all
//

app.get(
    "/api/foods/all",
    (req, res) => {

        try {

            const foods =
                readFoods();


            res.json({

                success: true,

                count:
                    foods.length,

                foods:
                    foods

            });

        }

        catch (error) {

            console.error(
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Failed to load foods"

            });

        }

    }
);


// ============================================================
// GET MARKETPLACE FOODS
// ============================================================
//
// IMPORTANT:
//
// GET /api/foods
//
// Only available food appears in Marketplace.
//
// Duplicates are removed.
//

app.get(
    "/api/foods",
    (req, res) => {

        try {

            const foods =
                readFoods();


            // --------------------------------------------
            // ONLY AVAILABLE FOOD
            // --------------------------------------------

            const availableFoods =
                foods.filter(
                    food =>
                        food.status ===
                        "available"
                );


            // --------------------------------------------
            // REMOVE DUPLICATES
            // --------------------------------------------

            const seen =
                new Set();


            const uniqueFoods =
                availableFoods.filter(
                    food => {

                        const signature = [

                            String(
                                food.name ||
                                ""
                            )
                                .trim()
                                .toLowerCase(),

                            String(
                                food.category ||
                                ""
                            )
                                .trim()
                                .toLowerCase(),

                            Number(
                                food.quantity
                            ),

                            String(
                                food.unit ||
                                ""
                            )
                                .trim()
                                .toUpperCase(),

                            Number(
                                food.shelfLife
                            ),

                            Number(
                                food.price
                            ),

                            String(
                                food.source ||
                                ""
                            )
                                .trim()
                                .toLowerCase()

                        ].join("|");


                        if (
                            seen.has(
                                signature
                            )
                        ) {

                            return false;

                        }


                        seen.add(
                            signature
                        );


                        return true;

                    }
                );


            res.json({

                success: true,

                count:
                    uniqueFoods.length,

                foods:
                    uniqueFoods

            });

        }

        catch (error) {

            console.error(
                "GET /api/foods error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to load marketplace foods"

            });

        }

    }
);


// ============================================================
// GET SINGLE FOOD
// ============================================================
//
// GET /api/foods/:id
//

app.get(
    "/api/foods/:id",
    (req, res) => {

        try {

            const id =
                Number(
                    req.params.id
                );


            const foods =
                readFoods();


            const food =
                foods.find(
                    item =>
                        Number(item.id) ===
                        id
                );


            if (!food) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Food item not found"

                });

            }


            res.json({

                success: true,

                food:
                    food

            });

        }

        catch (error) {

            console.error(
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to find food"

            });

        }

    }
);


// ============================================================
// ADD FOOD FROM FARMER
// ============================================================
//
// POST /api/foods
//
// This is the important endpoint for farmer.html
//

app.post(
    "/api/foods",
    (req, res) => {

        try {

            console.log(
                "\n================================"
            );

            console.log(
                "POST /api/foods"
            );

            console.log(
                "Received:",
                req.body
            );

            console.log(
                "================================"
            );


            // --------------------------------------------
            // GET DATA FROM FARMER
            // --------------------------------------------

            const {

                name,

                category,

                quantity,

                unit,

                shelfLife,

                price,

                originalPrice,

                source

            } = req.body;


            // --------------------------------------------
            // VALIDATION
            // --------------------------------------------

            if (
                !name ||
                !category ||
                quantity === undefined ||
                quantity === null ||
                !unit ||
                shelfLife === undefined ||
                shelfLife === null ||
                price === undefined ||
                price === null
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Required food details are missing",

                    required: [

                        "name",

                        "category",

                        "quantity",

                        "unit",

                        "shelfLife",

                        "price"

                    ]

                });

            }


            // --------------------------------------------
            // CONVERT NUMBERS
            // --------------------------------------------

            const numericQuantity =
                Number(quantity);


            const numericShelfLife =
                Number(shelfLife);


            const numericPrice =
                Number(price);


            const numericOriginalPrice =
                originalPrice !== undefined &&
                originalPrice !== null &&
                originalPrice !== ""
                    ? Number(originalPrice)
                    : numericPrice;


            // --------------------------------------------
            // NUMBER VALIDATION
            // --------------------------------------------

            if (
                !Number.isFinite(
                    numericQuantity
                ) ||
                numericQuantity <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Quantity must be a valid number greater than 0"

                });

            }


            if (
                !Number.isFinite(
                    numericShelfLife
                ) ||
                numericShelfLife < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Shelf life must be a valid number"

                });

            }


            if (
                !Number.isFinite(
                    numericPrice
                ) ||
                numericPrice < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Price must be a valid number"

                });

            }


            // --------------------------------------------
            // READ CURRENT FOODS
            // --------------------------------------------

            const foods =
                readFoods();


            // --------------------------------------------
            // CREATE NEW ID
            // --------------------------------------------

            const newId =
                foods.length > 0

                    ? Math.max(
                        ...foods.map(
                            food =>
                                Number(
                                    food.id
                                ) || 0
                        )
                    ) + 1

                    : 1;


            // --------------------------------------------
            // FOODPULSE AI RISK
            // --------------------------------------------

            const risk =
                calculateRisk(

                    numericShelfLife,

                    numericQuantity

                );


            // --------------------------------------------
            // CREATE FOOD OBJECT
            // --------------------------------------------

            const newFood = {

                id:
                    newId,

                name:
                    String(
                        name
                    ).trim(),

                category:
                    String(
                        category
                    ).trim().toLowerCase(),

                quantity:
                    numericQuantity,

                unit:
                    String(
                        unit
                    ).trim().toUpperCase(),

                shelfLife:
                    numericShelfLife,

                price:
                    numericPrice,

                originalPrice:
                    numericOriginalPrice,

                risk:
                    risk,

                status:
                    "available",

                source:
                    source
                        ? String(
                            source
                        ).trim()
                        : "Unknown",

                createdAt:
                    new Date().toISOString()

            };


            // --------------------------------------------
            // SAVE FOOD
            // --------------------------------------------

            foods.push(
                newFood
            );


            const saved =
                writeFoods(
                    foods
                );


            if (!saved) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Food could not be saved"

                });

            }


            // --------------------------------------------
            // SUCCESS
            // --------------------------------------------

            console.log(
                "Food added successfully:",
                newFood
            );


            return res.status(201).json({

                success: true,

                message:
                    "Food added successfully",

                food:
                    newFood

            });

        }

        catch (error) {

            console.error(
                "POST /api/foods ERROR:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to add food",

                error:
                    error.message

            });

        }

    }
);


// ============================================================
// FOODPULSE AI RISK CALCULATION
// ============================================================

function calculateRisk(
    shelfLife,
    quantity
) {

    let risk = 0;


    // --------------------------------------------
    // SHELF LIFE
    // --------------------------------------------

    if (
        shelfLife <= 1
    ) {

        risk += 60;

    }

    else if (
        shelfLife <= 2
    ) {

        risk += 45;

    }

    else if (
        shelfLife <= 3
    ) {

        risk += 30;

    }

    else if (
        shelfLife <= 7
    ) {

        risk += 15;

    }

    else {

        risk += 5;

    }


    // --------------------------------------------
    // QUANTITY
    // --------------------------------------------

    if (
        quantity >= 100
    ) {

        risk += 25;

    }

    else if (
        quantity >= 50
    ) {

        risk += 18;

    }

    else if (
        quantity >= 20
    ) {

        risk += 10;

    }


    return Math.min(
        99,
        Math.max(
            1,
            risk
        )
    );

}


// ============================================================
// GET RISK LEVEL
// ============================================================

function getRiskLevel(
    risk
) {

    if (
        risk >= 90
    ) {

        return "critical";

    }


    if (
        risk >= 75
    ) {

        return "high";

    }


    if (
        risk >= 50
    ) {

        return "medium";

    }


    return "low";

}


// ============================================================
// AI RECOMMENDATION
// ============================================================

function getRecommendation(
    risk
) {

    if (
        risk >= 90
    ) {

        return "Immediate NGO rescue";

    }


    if (
        risk >= 75
    ) {

        return "Redirect to NGO or consumer";

    }


    if (
        risk >= 50
    ) {

        return "Offer consumer discount";

    }


    return "Keep in normal marketplace";

}


// ============================================================
// FOODPULSE AI ANALYSIS
// ============================================================
//
// GET /api/ai/analyze
//

app.get(
    "/api/ai/analyze",
    (req, res) => {

        try {

            const foods =
                readFoods();


            const analyzed =
                foods.map(
                    food => ({

                        ...food,

                        riskLevel:
                            getRiskLevel(
                                Number(
                                    food.risk
                                )
                            ),

                        recommendation:
                            getRecommendation(
                                Number(
                                    food.risk
                                )
                            )

                    })
                );


            res.json({

                success: true,

                engine:
                    "FoodPulse AI",

                count:
                    analyzed.length,

                foods:
                    analyzed

            });

        }

        catch (error) {

            console.error(
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "AI analysis failed"

            });

        }

    }
);


// ============================================================
// NGO MATCH
// ============================================================
//
// GET /api/ngo/match/:foodId
//

app.get(
    "/api/ngo/match/:foodId",
    (req, res) => {

        try {

            const foodId =
                Number(
                    req.params.foodId
                );


            const foods =
                readFoods();


            const food =
                foods.find(
                    item =>
                        Number(
                            item.id
                        ) === foodId
                );


            if (!food) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Food item not found"

                });

            }


            const match =
                calculateNGOMatch(
                    food
                );


            res.json({

                success: true,

                food:
                    food.name,

                foodId:
                    food.id,

                matchScore:
                    match.score,

                factors:
                    match.factors,

                recommendation:
                    match.recommendation

            });

        }

        catch (error) {

            console.error(
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "NGO matching failed"

            });

        }

    }
);


// ============================================================
// NGO MATCHING ENGINE
// ============================================================

function calculateNGOMatch(
    food
) {

    // --------------------------------------------
    // URGENCY
    // --------------------------------------------

    const urgency =
        Math.min(
            Number(
                food.risk
            ) || 1,
            100
        );


    // --------------------------------------------
    // DISTANCE
    //
    // Demo value for hackathon.
    // Later replace with Google Maps distance.
    // --------------------------------------------

    const distance =
        92;


    // --------------------------------------------
    // NGO CAPACITY
    // --------------------------------------------

    const capacity =
        Number(
            food.quantity
        ) <= 150

            ? 95

            : 82;


    // --------------------------------------------
    // FOOD COMPATIBILITY
    // --------------------------------------------

    const category =
        String(
            food.category ||
            ""
        )
            .toLowerCase();


    const compatibility =
        category === "dairy"

            ? 98

            : 94;


    // --------------------------------------------
    // COMMUNITY NEED
    // --------------------------------------------

    const communityNeed =
        Number(
            food.risk
        ) >= 85

            ? 96

            : 90;


    // --------------------------------------------
    // FINAL SCORE
    // --------------------------------------------

    const score =
        Math.round(

            (

                urgency +

                distance +

                capacity +

                compatibility +

                communityNeed

            ) / 5

        );


    return {

        score:

            Math.min(
                99,
                Math.max(
                    1,
                    score
                )
            ),

        factors: {

            urgency,

            distance,

            capacity,

            compatibility,

            communityNeed

        },

        recommendation:

            score >= 90

                ? "Excellent NGO match"

                : "Suitable NGO match"

    };

}


// ============================================================
// CONSUMER ORDER
// ============================================================
//
// POST /api/orders
//
// Body:
//
// {
//     "foodId": 1,
//     "quantity": 5
// }
//

app.post(
    "/api/orders",
    (req, res) => {

        try {

            const {

                foodId,

                quantity

            } = req.body;


            const numericFoodId =
                Number(
                    foodId
                );


            const requestedQuantity =
                Number(
                    quantity
                );


            if (
                !Number.isFinite(
                    numericFoodId
                ) ||
                !Number.isFinite(
                    requestedQuantity
                ) ||
                requestedQuantity <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Valid foodId and quantity are required"

                });

            }


            const foods =
                readFoods();


            const food =
                foods.find(
                    item =>
                        Number(
                            item.id
                        ) ===
                        numericFoodId
                );


            if (!food) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Food item not found"

                });

            }


            if (
                food.status !==
                "available"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Food is no longer available"

                });

            }


            if (
                requestedQuantity >
                Number(
                    food.quantity
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Requested quantity is greater than available quantity",

                    availableQuantity:
                        food.quantity

                });

            }


            // --------------------------------------------
            // REDUCE INVENTORY
            // --------------------------------------------

            food.quantity =
                Number(
                    food.quantity
                ) -
                requestedQuantity;


            if (
                food.quantity <= 0
            ) {

                food.quantity = 0;

                food.status =
                    "sold";

            }


            writeFoods(
                foods
            );


            const order = {

                id:
                    Date.now(),

                foodId:
                    food.id,

                food:
                    food.name,

                quantity:
                    requestedQuantity,

                price:
                    food.price,

                total:
                    requestedQuantity *
                    Number(
                        food.price
                    ),

                status:
                    "confirmed",

                createdAt:
                    new Date().toISOString()

            };


            res.json({

                success: true,

                message:
                    "Food purchase successful",

                order:
                    order

            });

        }

        catch (error) {

            console.error(
                "POST /api/orders ERROR:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Order failed"

            });

        }

    }
);


// ============================================================
// NGO DONATION
// ============================================================
//
// POST /api/donations
//
// Body:
//
// {
//     "foodId": 1,
//     "ngoName": "Helping Hands NGO"
// }
//

app.post(
    "/api/donations",
    (req, res) => {

        try {

            const {

                foodId,

                ngoName

            } = req.body;


            const foods =
                readFoods();


            const food =
                foods.find(
                    item =>
                        Number(
                            item.id
                        ) ===
                        Number(
                            foodId
                        )
                );


            if (!food) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Food item not found"

                });

            }


            if (
                food.status !==
                "available"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Food is no longer available"

                });

            }


            food.status =
                "donation_accepted";


            food.ngo =
                ngoName ||
                "Helping Hands NGO";


            writeFoods(
                foods
            );


            res.json({

                success: true,

                message:
                    "Donation accepted",

                donation: {

                    id:
                        Date.now(),

                    foodId:
                        food.id,

                    food:
                        food.name,

                    quantity:
                        food.quantity,

                    ngo:
                        food.ngo,

                    status:
                        "accepted",

                    createdAt:
                        new Date().toISOString()

                }

            });

        }

        catch (error) {

            console.error(
                "POST /api/donations ERROR:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Donation failed"

            });

        }

    }
);


// ============================================================
// RESTORE FOOD
// ============================================================
//
// Useful during testing.
//
// PUT /api/foods/:id/restore
//

app.put(
    "/api/foods/:id/restore",
    (req, res) => {

        try {

            const foods =
                readFoods();


            const food =
                foods.find(
                    item =>
                        Number(
                            item.id
                        ) ===
                        Number(
                            req.params.id
                        )
                );


            if (!food) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Food item not found"

                });

            }


            food.status =
                "available";


            writeFoods(
                foods
            );


            res.json({

                success: true,

                message:
                    "Food restored",

                food:
                    food

            });

        }

        catch (error) {

            console.error(
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Could not restore food"

            });

        }

    }
);


// ============================================================
// DELETE FOOD
// ============================================================
//
// DELETE /api/foods/:id
//

app.delete(
    "/api/foods/:id",
    (req, res) => {

        try {

            const foods =
                readFoods();


            const id =
                Number(
                    req.params.id
                );


            const index =
                foods.findIndex(
                    item =>
                        Number(
                            item.id
                        ) === id
                );


            if (
                index === -1
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Food item not found"

                });

            }


            const deletedFood =
                foods[index];


            foods.splice(
                index,
                1
            );


            writeFoods(
                foods
            );


            res.json({

                success: true,

                message:
                    "Food deleted",

                food:
                    deletedFood

            });

        }

        catch (error) {

            console.error(
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Could not delete food"

            });

        }

    }
);


// ============================================================
// 404 API HANDLER
// ============================================================
//
// If you see this message, the endpoint really does not exist.
//

app.use(
    "/api",
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "API endpoint not found",

            method:
                req.method,

            path:
                req.originalUrl

        });

    }
);


// ============================================================
// GENERAL ERROR HANDLER
// ============================================================

app.use(
    (error, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Internal server error",

            error:
                error.message

        });

    }
);


// ============================================================
// START SERVER
// ============================================================

app.listen(
    PORT,
    () => {

        console.log(
            "\n=========================================="
        );

        console.log(
            "🌱 FOODLINK + FOODPULSE AI"
        );

        console.log(
            "=========================================="
        );

        console.log(
            `🚀 Server running on http://localhost:${PORT}`
        );

        console.log(
            `❤️  Health: http://localhost:${PORT}/`
        );

        console.log(
            `🍎 Marketplace: http://localhost:${PORT}/api/foods`
        );

        console.log(
            `➕ Farmer POST: http://localhost:${PORT}/api/foods`
        );

        console.log(
            `🤖 AI: http://localhost:${PORT}/api/ai/analyze`
        );

        console.log(
            `❤️  NGO: http://localhost:${PORT}/api/ngo/match/:foodId`
        );

        console.log(
            "==========================================\n"
        );

    }
);