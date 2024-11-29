/**
 * @swagger
 * /api/wallet/transaction:
 *   post:
 *     tags:
 *       - Module Transactions
 *     summary: transaction process
 *     description: transaction process
 *     requestBody: 
 *      content: 
 *        application/json: 
 *          schema: 
 *            type: object
 *            properties:
 *              serviceCode: 
 *                type: string
 *                description: serviceCode transaction
 *                example: "PULSA"
 *            required:
 *              - serviceCode
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
 *                   description: Transaction Berhasil!
 *                   example: Transaction Berhasil!
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
 *                        example: serviceCode is required
 *                      param:
 *                        type: string
 *                        example: serviceCode
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
import { Service } from "../../models/service";

const router = express.Router();

const pipelineValidation = [
  body("serviceCode")
  .not()
  .isEmpty()
  .withMessage("service Code Is Required")
  .bail()
]

router.post('/api/wallet/transaction', pipelineValidation, async (req: Request, res:Response) => {
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

  const getService = await Service.findOne({
    serviceCode: req.body.serviceCode
  })

  if (!getService) {
    return res.status(404).send({
      status: "error",
      message: `Service code ${req.body.serviceCode} not found`,
    })
  }

  if (getWallet.balance < getService.serviceTarif) {
    return res.status(401).send({
      status: "error",
      message: `Wallet balance not enough`,
    })
  }

  const invoiceNumber = generateInvoiceNumber()

  try {
    await Transaction.create({
      userId: userId,
      invoiceNumber: invoiceNumber,
      transactionType: "PAYMENT",
      totalAmount: getService.serviceTarif,
      description: `payment service ${getService.serviceName}`,
      serviceCode: getService.serviceCode
    })

    getWallet.set({
      balance: getWallet.balance - getService.serviceTarif
    })  
    await getWallet.save()
  } catch (error) {
    return res.status(401).send({
      status: "error",
      message: `error when process transaction`,
    })
  }

  res.status(200).send({
    status: "success",
    message: "Topup Berhasil!",
  });
});

export default router;
