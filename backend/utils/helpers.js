import jwt from "jsonwebtoken";
import bunyan from "bunyan";

export const MAX_AGE_ACCESS_TOKEN = 15 * 60; // 15 minutes
export const MAX_AGE_REFRESH_TOKEN = 7 * 24 * 60 * 60; // 7 days

/* Logger instance */
export const logger = bunyan.createLogger({ name: "2FA-app" });

/* Generate JWT token */
export const generateToken = (user, type) => {
  if (type === "access") {
    return jwt.sign(
      { id: user._id, name: user.name, role: user.role, email: user.email },
      process.env.ACCESS_SECRET,
      {
        expiresIn: MAX_AGE_ACCESS_TOKEN,
      }
    );
  }
  if (type === "refresh") {
    return jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
      expiresIn: MAX_AGE_REFRESH_TOKEN,
    });
  }
};
