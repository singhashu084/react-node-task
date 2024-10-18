import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  userId?: string;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const isCustomAuth = token && token.length < 500;

    let decodeData: string | JwtPayload | null;;
    if (token && isCustomAuth) {
      decodeData = jwt.verify(token, "test") as JwtPayload;
      req.userId = decodeData?.id as string;
    } else {
      decodeData = jwt.decode(token) as JwtPayload;
      req.userId = decodeData?.id as string;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default auth;
