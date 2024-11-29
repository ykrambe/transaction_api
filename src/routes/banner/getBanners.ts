/**
 * @swagger
 * /api/banners:
 *   get:
 *     tags:
 *       - Module infomation
 *     summary: get Banner information
 *     description: get Banner information
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
 *                   description: successfully get banner
 *                   example: successfully get banner
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                        bannerName:
 *                          type: string
 *                          example: Banner 1
 *                        bannerImage:
 *                          type: string
 *                          example: https://nutech-integrasi.app/dummy.jpg
 *                        description:
 *                          type: string
 *                          example: Lerem Ipsum Dolor sit amet
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
import { Banner } from "../../models/banner";

const router = express.Router();

router.get('/api/banners', async (req: Request, res:Response) => {
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

  const banner = await Banner.find({})

  res.status(200).send({
    status: "success",
    message: "successfully get banner",
    data: banner
  });
});

export default router;
