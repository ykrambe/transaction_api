/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Module Auth
 *     summary: logout user
 *     description: login user
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       201:
 *         description: Logout Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: success
 *                   example: success
 *                 message:
 *                   type: string
 *                   description: User logout Successfully  !
 *                   example: User logout Successfully  !
 *                 data:
 *                  oneOf:
 *                   - type: object
 *                   - type: null
 *                  example: null
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
 * 
 */

import express, { Request, Response } from 'express';
import { closeSession, validateSessions } from '../../utils/authSessions';

const router = express.Router();
router.post(
  '/api/auth/logout',
  async (req: Request, res: Response) => {
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

    const endSession = await closeSession(token)

    if (endSession) {
      res.status(200)
      .send({
        status: "success",
        message: "successfully logout"
      });
    }else {
      res.status(401).send({
        status: "error",
        message: `Invalid Token or revoked token.`,
      })
    }    
  },
);

export default router

