/**
 * @swagger
 * /api/user/profile/update:
 *   put:
 *     tags:
 *       - Module Profile
 *     summary: update user profile
 *     description: update user profile
 *     security:
 *      - bearerAuth: []
 *     requestBody: 
 *      content: 
 *        application/json: 
 *          schema: 
 *            type: object
 *            properties:
 *              firstName: 
 *                type: string
 *                description: First Name
 *                example: john
 *              lastName: 
 *                type: string
 *                description: Last Name
 *                example: doe
 *            required:
 *              - firstName
 *              - lastName
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
 *                   description: User updated
 *                   example: User Successfully updated !
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: johny
 *                     lastName:
 *                       type: string
 *                       example: done
 *                     email:
 *                       type: string
 *                       example: johndoe@mail.com
 *                     profileImage:
 *                       type: string
 *                       example: 
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
 *                  description: error
 *                  example: error
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
 *                        example: firstName is required
 *                      param:
 *                        type: string
 *                        example: firstName
 *                      location: 
 *                        type: string
 *                        example: body 
 */

import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../../models/user";
import { validateSessions } from "../../utils/authSessions";
import { Authentication } from "../../models/authentication";

const router = express.Router();

const pipelineValidation = [
  body("firstName")
    .not()
    .isEmpty()
    .withMessage("First Name Is Required")
    .bail(),
  body("lastName")
    .not()
    .isEmpty()
    .withMessage("Last Name Is Required")
    .bail()
]

router.put(
  "/api/user/profile/update", pipelineValidation, 
  async (req: Request, res: Response) => {
    const {
      firstName,
      lastName
    } = req.body

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

		const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({
        status: "error",
        message: "Data Not Valid",
        errors: errors.array(),
      });
    }

    const getSession = await Authentication.findOne({ token: token })
    if (!getSession) {
      return res.status(401).send({
        status: "error",
        message: `Session not found.`,
      })
    }
  
    const userId = getSession?.userId
    const getUser = await User.findById(userId)
    if (!getUser) {
      return res.status(404).send({
        status: "error",
        message: `user with id ${req.params.id} not found`,
      })
    }

    getUser.set({
      firstName,
      lastName,
    })

    await getUser.save()

    getUser.set({
      password: null
    })

    res.status(201).send({ 
			status: "success",
      message: "User Successfully updated !",
			data: getUser,
		});
  }
);

export default router
