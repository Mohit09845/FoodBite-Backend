import { auth } from "express-oauth2-jwt-bearer";
import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import User from "../model/user.model";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

export const jwtParse: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    res.status(401).json({ message: 'Unauthorized access' });
    return;
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id })

    if (!user) {
      res.sendStatus(401);
      return;
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();

  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
}