"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate); // Protect all post routes
router.post('/generate', post_controller_1.generatePost);
router.post('/', post_controller_1.createPost);
router.get('/', post_controller_1.getPosts);
exports.default = router;
