"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const validate_1 = require("../middleware/validate");
const post_schema_1 = require("../schemas/post.schema");
const router = (0, express_1.Router)();
router.post('/generate', auth_1.authenticate, (0, rateLimit_1.rateLimit)({
    windowMs: 60 * 1000,
    max: 10,
    keyGenerator: (req) => {
        var _a;
        const authReq = req;
        return ((_a = authReq.user) === null || _a === void 0 ? void 0 : _a.uid) || req.ip;
    }
}), (0, validate_1.validate)(post_schema_1.generatePostSchema), post_controller_1.generatePost);
router.use(auth_1.authenticate); // Protect all post routes
router.post('/', (0, validate_1.validate)(post_schema_1.createPostSchema), post_controller_1.createPost);
router.get('/', post_controller_1.getPosts);
exports.default = router;
