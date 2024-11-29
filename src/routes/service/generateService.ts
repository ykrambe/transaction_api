//swagger documentation

import express, { Request, Response } from "express";
import { validateSessions } from "../../utils/authSessions";
import { Service } from "../../models/service";

const router = express.Router();

router.post('/api/generate-service', async (req: Request, res:Response) => {
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

    const countService = await Service.countDocuments()
    if (countService > 0) {
      return res.status(200).send({
        status: "success",
        message: "service already exist",
      });
    }

    const listCode = [
      "PAJAK", "PLN", "PDAM", "PULSA", "PGN", 
      "MUSIK", "TV", "PAKET_DATA", "VOUCHER_GAME", 
      "VOUCHER_MAKANAN", "QURBAN", "ZAKAT"
    ];

    const listName = [
      "Pajak PBB", "Listrik", "PDAM Berlangganan", "Pulsa", "PGN Berlangganan",
      "Musik Berlangganan", "TV Berlangganan", "Paket Data", "Voucher Game",
      "Voucher Makanan", "Qurban", "Zakat"
    ];

    const listIcon = [
      "https://minio.nutech-integrasi.com/take-home-test/services/PBB.png",
      "https://minio.nutech-integrasi.com/take-home-test/services/Listrik.png",
      "https://minio.nutech-integrasi.com/take-home-test/services/PDAM.png",
      "https://minio.nutech-integrasi.com/take-home-test/services/Pulsa.png",
      "https://minio.nutech-integrasi.com/take-home-test/services/PGN.png",
      "https://minio.nutech-integrasi.com/take-home-test/services/Musik.png",
      "https://minio.nutech-integrasi.com/take-home-test/services/Televisi.png",
      "https://minio.nutech-integrasi.com/take-home-test/services/Paket-Data.png",
      "https://minio.nutech-integrasi.com/take-home-test/services/Game.png",
      "https://minio.nutech-integrasi.com/take-home-test/services/Voucher-Makanan.png",
      "https://minio.nutech-integrasi.com/take-home-test/services/Qurban.png",
      "https://minio.nutech-integrasi.com/take-home-test/services/Zakat.png"
    ];

    const listTarif = [
      40000, 10000, 40000, 40000, 50000,
      50000, 50000, 50000, 100000, 100000,
      200000, 300000
    ];

    for (let i = 0; i < 10; i++) {
      await Service.create({
        serviceCode: listCode[i],
        serviceName: listName[i],
        serviceIcon: listIcon[i],
        serviceTarif: listTarif[i],
      })
    }

  res.status(200).send({
    status: "success",
    message: "successfully generate service",
  });
});

export default router;
