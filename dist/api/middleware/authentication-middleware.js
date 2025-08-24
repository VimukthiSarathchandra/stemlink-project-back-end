"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unauthorized_error_1 = __importDefault(require("../../domain/errors/unauthorized-error"));
const isAuthenticated = (req, res, next) => {
    if (!req?.auth) {
        //! req.auth will only be defined if the request sends a valid session token
        throw new unauthorized_error_1.default("Unauthorized");
    }
    // clerkClient.users.updateUser(req.auth.userId, {
    //   publicMetadata: {
    //   },
    // });
    //! By calling req.auth() or passing the request to getAuth() we can get the auth data from the request
    //! userId can be obtained from the auth object
    // console.log(req.auth());
    // console.log(getAuth(req));
    next();
};
exports.default = isAuthenticated;
//# sourceMappingURL=authentication-middleware.js.map