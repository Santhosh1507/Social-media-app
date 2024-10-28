import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });
};

export default generateToken;
