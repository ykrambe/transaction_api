//swagger documentation

import express, { Request, Response } from "express";
import { User } from "../../models/user";
import { validateSessions } from "../../utils/authSessions";

const router = express.Router();

router.get('/api/users', async (req: Request, res:Response) => {
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


	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	const users = await User.aggregate([
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

  const totalusers = await User.countDocuments();

  res.status(200).send({
    status: "success",
    totalusers,
    totalPages: Math.ceil(totalusers / limit),
    currentPage: page,
    data: users
  });
});

export default router;
