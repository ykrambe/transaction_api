/**
 * @swagger
 * /api/transaction/history:
 *   get:
 *     tags:
 *       - Module Transactions
 *     summary: get wallet Balance
 *     description: get wallet Balance
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          default: 1
 *        required: true
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          default: 10
 *        required: true
 * 
 *     responses:
 *       200:
 *         description: Request Get Histor Success
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
 *                   description: Get Transaction History Success
 *                   example: Get Transaction History Success
 *                 totalTransactions:
 *                   type: string
 *                   description: total tranactions
 *                   example: 10
 *                 totalPages:
 *                   type: string
 *                   description: total pages for pagination
 *                   example: 1
 *                 currentPage:
 *                   type: string
 *                   description: current pages for pagination
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1
 *                       userId:
 *                         type: string
 *                         example: 1
 *                       transactionType:
 *                         type: string
 *                         example: TOPUP
 *                       totalAmount:
 *                         type: number
 *                         example: 100000
 *                       description:
 *                         type: string
 *                         example: TOPUP
 *                       serviceCode:
 *                         type: string
 *                         example: PULSA
 *                       createdAt:
 *                         type: date
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
import { Transaction } from "../../models/transaction";

const router = express.Router();

router.get('/api/transaction/history', async (req: Request, res:Response) => {
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

  const userId = getSession.userId

	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	const history = await Transaction.aggregate([
    { $match: { userId: userId } },
		{ $sort: { createdAt: 1 } }, // Sort by title
		{ $skip: skip }, // Skip for pagination
		{ $limit: limit }, // limit result
    {
      $addFields: {
        "id": "$_id"
      }
    },
    { $project: { password: 0, _id: 0 } }
  ]);

  const totalTransactions = await Transaction.countDocuments({
    userId: userId
  });

  res.status(200).send({
    status: "success",
    message: "Get Transaction History Success",
    totalTransactions,
    totalPages: Math.ceil(totalTransactions / limit),
    currentPage: page,
    data: history
  });
});

export default router;
