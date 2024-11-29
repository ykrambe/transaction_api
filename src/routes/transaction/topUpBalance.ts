/**
 * @swagger
 * /api/wallet/topup:
 *   post:
 *     tags:
 *       - Module Transactions
 *     summary: topup wallet Balance
 *     description: topup wallet Balance
 *     requestBody: 
 *      content: 
 *        application/json: 
 *          schema: 
 *            type: object
 *            properties:
 *              topUpAmount: 
 *                type: number
 *                description: amount to topup
 *                example: 50000
 *            required:
 *              - firstName
 *     security:
 *      - bearerAuth: []
 * 
 *     responses:
 *       201:
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
 *                 message:
 *                   type: string
 *                   description: Topup Berhasil!
 *                   example: Topup Berhasil!
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
 *       422:
 *         description:  Incorrect parameters, headers, or data in the request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                status:
 *                  type: string
 *                  description: errors
 *                  example: errors
 *                message:
 *                  type: string
 *                  description: Data Not Valid
 *                  example: Data Not Valid
 *                errors:
 *                  type: array
 *                  items:  
 *                    type: object
 *                    properties:
 *                      msg:
 *                        type: string
 *                        example: topUpAmount must be a number
 *                      param:
 *                        type: string
 *                        example: topUpAmount
 *                      location: 
 *                        type: string
 *                        example: body 
 */

import express, { Request, Response } from "express";
import { validateSessions } from "../../utils/authSessions";
import { Authentication } from "../../models/authentication";
import { Wallet } from "../../models/wallet";
import { body, validationResult } from "express-validator";
import { Transaction } from "../../models/transaction";
import { generateInvoiceNumber } from "../../utils/generator";

const router = express.Router();

const pipelineValidation = [
  body("topUpAmount")
  .not()
  .isEmpty()
  .withMessage("First Name Is Required")
  .bail()
  .isNumeric()
  .withMessage("Top Up Amount must be a number")
]

router.post('/api/wallet/topup', pipelineValidation, async (req: Request, res:Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({
      status: "error",
      message: "Data Not Valid",
      errors: errors.array(),
    });
  }

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

  const invoiceNumber = generateInvoiceNumber()

  try {
    await Transaction.create({
      userId: userId,
      invoiceNumber: invoiceNumber,
      transactionType: "TOPUP",
      totalAmount: req.body.topUpAmount,
      description: "Topup Wallet Balance"
    })

    getWallet.set({
      balance: getWallet.balance + req.body.topUpAmount
    })
  
    await getWallet.save()
  } catch (error) {
    return res.status(401).send({
      status: "error",
      message: `error when update wallet balance`,
    })
  }

  res.status(200).send({
    status: "success",
    message: "Topup Berhasil!",
  });
});

export default router;
