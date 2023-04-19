import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyAuth = (req, res, next) => {

    const token = req.cookies.access_token;

    if (!token) {
        return next(createError(401, "You are not authenticated!"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        req.user = user;

        // if (err) return next(createError(403, "Token is not valid!"));

        if (req?.user?.id === req?.params?.id || req?.user?.isAdmin) {
            return next();
        } else if (req?.user?.isAdmin) {
            return next();
        } else if (err) {
            return next(createError(403, "Token is not valid!"));
        } else {
            return next(createError(403, "You are not authorized!"));
        }
        // next();
    });
};



export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};