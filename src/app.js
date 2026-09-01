const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const weightRoutes = require("./routes/weightRoutes");
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const testimonialsRoutes = require("./routes/testimonialRoutes")
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactUsRoutes")
const cartRoutes = require("./routes/cartRoutes")
const searchRoutes = require("./routes/searchRoutes")
const bulkOrderRoutes = require("./routes/bulkOrderRoutes");
const orderRoutes = require("./routes/orderRoutes");
const featureProductRoutes = require("./routes/featureProductRoutes")
const faqRoutes = require("./routes/faqRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

const cors = require("cors");

const app = express();



const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://project-alpha-demo.vercel.app",
    "https://project-alpha-new.vercel.app"
];

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow Postman, server-to-server requests, etc.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],

        credentials: true
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/weights", weightRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/feature-product", featureProductRoutes)
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/testimonials", testimonialsRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/search",searchRoutes)
app.use("/api/v1/bulk-orders",bulkOrderRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/faqs", faqRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

module.exports = app;