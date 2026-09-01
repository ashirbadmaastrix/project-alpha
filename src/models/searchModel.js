const path = require("path");
const fs = require("fs");

const dataPath = path.join(__dirname, "../data/data.json");

const getProducts = () => {
    try {
        const data = fs.readFileSync(dataPath, "utf-8");

        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading data.json:", error);
        return [];
    }
};

const searchProducts = (search) => {
    const products = getProducts();

    const query = search.trim().toLowerCase();

    if (!query) {
        return [];
    }

    const startsWith = [];
    const contains = [];

    products.forEach((product) => {
        const name = product.name?.toLowerCase() || "";

        if (name.startsWith(query)) {
            startsWith.push(product);
        } else if (name.includes(query)) {
            contains.push(product);
        }
    });

    return [...startsWith, ...contains];
};

module.exports = {
    getProducts,
    searchProducts
};