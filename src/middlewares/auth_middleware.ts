import { Request, Response, NextFunction } from "express";
import { jwt_key } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthReq extends Request {
  userId?: number;
}

export function auth_middleware(
  req: AuthReq,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    const decodedJWT = jwt.verify(token, jwt_key) as JwtPayload;

    if (!decodedJWT.id) {
      return res.status(401).json({
        message: "invaild token",
      });
    }
    req.userId = Number(decodedJWT.id);
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
