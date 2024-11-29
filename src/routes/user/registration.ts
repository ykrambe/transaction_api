/**
 * @swagger
 * /api/user/registration:
 *   post:
 *     tags:
 *       - Module Auth
 *     summary: registration new user
 *     description: registration new user
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
 *              email: 
 *                type: string
 *                description: email
 *                example: johndone@mail.com    
 *              password: 
 *                type: string
 *                description: password
 *                example: thisIsPassword
 *            required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
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
 *                   description: User Successfully Registered !
 *                   example: User Successfully Registered !
 *                 data:
 *                  oneOf:
 *                   - type: object
 *                   - type: null
 *                  example: null
 * 
 *       401:
 *         description:  Bad Request
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
 *                  description: Email already exists
 *                  example: Email already exists
 * 
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
 *                        example: Must be a valid email
 *                      param:
 *                        type: string
 *                        example: email
 *                      location: 
 *                        type: string
 *                        example: body 
 */

import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../../models/user";
import { Wallet } from "../../models/wallet";

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
    .bail(),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email Is Required")
    .bail()
    .isEmail()
    .withMessage("Email Is Not Valid"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password Is Required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Minimnum length of password is 4 and maximum length is 35")
]

router.post(
  "/api/user/registration", pipelineValidation, 
  async (req: Request, res: Response) => {
		const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send({
        status: "error",
        message: "Data Not Valid",
        errors: errors.array(),
      });
    }

    const {
      firstName,
      lastName,
      email,
      password
    } = req.body

    const checkEmail = await User.findOne({ email: email });
    if (checkEmail) {
      return res.status(401).send({
        status: "error",
        message: `email ${email} Already Exist`,
      })
    }

    const user = User.build({
      firstName,
      lastName,
      email,
      password
    });
    await user.save();

    const wallet = Wallet.build({
      userId: user._id,
      balance: 0,
      currency: "IDR"
    });
    await wallet.save();

    res.status(201).send({ 
			status: "success",
      message: "User Successfully Registered !",
			data: {},
		});
  }
);

export default router
