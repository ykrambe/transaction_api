/**
 * @swagger
 * /api/services:
 *   get:
 *     tags:
 *       - Module infomation
 *     summary: get Sevice information
 *     description: get Sevice information
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
 *                 message:
 *                   type: string
 *                   description: successfully get service
 *                   example: successfully get service
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                        serviceCode:
 *                          type: string
 *                          example: PAJAK
 *                        serviceName:
 *                          type: string
 *                          example: Pajak PBB
 *                        serviceIcon:
 *                          type: string
 *                          example: https://minio.nutech-integrasi.com/take-home-test/services/PBB.png
 *                        serviceTarif:
 *                          type: number
 *                          example: 40000
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
import { Service } from "../../models/service";

const router = express.Router();

router.get('/api/services', async (req: Request, res:Response) => {
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

  const services = await Service.find({})

  res.status(200).send({
    status: "success",
    message: "successfully get service",
    data: services
  });
});

export default router;
