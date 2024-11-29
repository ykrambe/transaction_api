//swagger documentation

import express, { Request, Response } from "express";
import { validateSessions } from "../../utils/authSessions";
import { Banner } from "../../models/banner";

const router = express.Router();

router.post('/api/generate-banner', async (req: Request, res:Response) => {
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

    const countBanner = await Banner.countDocuments()
    if (countBanner > 0) {
      return res.status(200).send({
        status: "success",
        message: "banner already exist",
      });
    }

    for (let i = 0; i < 10; i++) {
      await Banner.create({
        bannerName: `Banner ${i + 1}`,
        bannerImage: `https://nutech-integrasi.app/dummy.jpg`,
        description: "Lerem Ipsum Dolor sit amet",
      })
    }

  res.status(200).send({
    status: "success",
    message: "successfully generate banner",
  });
});

export default router;
