// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
	console.error(err);
	const statusCode = err.statusCode || 500;
	res.status(statusCode).json({ message: err.message || "Server error" });
};

// In your main server file

