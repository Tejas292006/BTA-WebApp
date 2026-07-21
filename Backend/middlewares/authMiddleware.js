import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token not provided",
      });
    }

    const token = authorizationHeader.split(" ")[1];

    const decryptedToken = jwt.verify(token, process.env.SECRET);

    req.body.userId = decryptedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export default authMiddleware;
