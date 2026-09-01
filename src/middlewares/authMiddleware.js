const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
	const authorizationHeader = req.headers.authorization;

	if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			success: false,
			message: "Authentication token is required",
		});
	}

	if (!process.env.JWT_SECRET) {
		console.error("JWT_SECRET is not configured");

		return res.status(500).json({
			success: false,
			message: "Authentication service is not configured",
		});
	}

	const token = authorizationHeader.substring(7).trim();

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Authentication token is required",
		});
	}

	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		return next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid or expired authentication token",
		});
	}
};

module.exports = authMiddleware;
