/**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     tags:
 *       - Module Transactions
 *     summary: get wallet Balance
 *     description: get wallet Balance
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
 *                     balance:
 *                       type: number
 *                       example: 100000
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
import { validateSessions } from "../../utils/authSessions";
import { Authentication } from "../../models/authentication";
import { Wallet } from "../../models/wallet";

const router = express.Router();

router.get('/api/wallet/balance', async (req: Request, res:Response) => {
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
  const getWallet = await Wallet.findOne({
    userId: userId
  })
  if (!getWallet) {
    return res.status(404).send({
      status: "error",
      message: `wallet not found`,
    })
  }


  res.status(200).send({
    status: "success",
    data: {
      balance : getWallet.balance
    }
  });
});

export default router;
