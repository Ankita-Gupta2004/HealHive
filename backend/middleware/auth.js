// Add curly braces here
import { admin } from "../firebaseAdmin.js"; 

export const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Change 'admin.auth()' to 'admin.auth'
    const decoded = await admin.auth.verifyIdToken(token); 
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};