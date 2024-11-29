/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags:
 *       - Module Profile
 *     summary: get user profile
 *     description: get user profile
 *     security:
 *      - bearerAuth: []
 * 
 *     responses:
 *       200:
 *         description: Request Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: success
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: john
 *                     lastName:
 *                       type: string
 *                       example: doe
 *                     email:
 *                       type: string
 *                       example: johndoe@mail.com
 *                     profileImage:
 *                       type: string
 *                       example: 
 * 
 *       401:
 *         description:  Token Invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                status:
 *                  type: string
 *                  description: error
 *                  example: error
 *                message:
 *                  type: string
 *                  description: Invalid Token or revoked token.
 *                  example: Invalid Token or revoked token.
 */

import express, { Request, Response } from "express";
import { User } from "../../models/user";
import { validateSessions } from "../../utils/authSessions";
import { Authentication } from "../../models/authentication";

const router = express.Router();

router.get('/api/user/profile', async (req: Request, res:Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({
      status: "error",
      message: `No token provided.`,
    })
  }

  const checkSession = await validateSessions(token)
  if (!checkSession) {
    return res.status(401).send({
      status: "error",
      message: `Invalid Token or revoked token.`,
    })
  }

  const getSession = await Authentication.findOne({ token: token })
  if (!getSession) {
    return res.status(401).send({
      status: "error",
      message: `Session not found.`,
    })
  }

  const userId = getSession?.userId
  const getUser = await User.findById(userId)
  if (!getUser) {
    return res.status(404).send({
      status: "error",
      message: `user with id ${req.params.id} not found`,
    })
  }

  getUser.set({
    password: null
  })

  res.status(200).send({
    status: "success",
    data: getUser
  });
});

export default router;
