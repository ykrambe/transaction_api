/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Module Auth
 *     summary: login user
 *     description: login user
 *     requestBody: 
 *      content: 
 *        application/json: 
 *          schema: 
 *            type: object
 *            properties:
 *              email: 
 *                type: string
 *                description: email
 *                example: johndoe@mail.com    
 *              password: 
 *                type: string
 *                description: password
 *                example: password
 *            required:
 *              - email
 *              - password
 *     responses:
 *       201:
 *         description: Login Success
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
 *                   description: User Successfully login !
 *                   example: User Successfully login !
 *                 data:
 *                  oneOf:
 *                   - type: object
 *                   - type: null
 *                  example: null
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
 *                  description: success
 *                  example: success
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
 * 
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
import { Password } from '../../utils/password';
import { Authentication } from '../../models/authentication';

const router = express.Router();
const pipelineValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email Is Required")
    .bail()
    .isEmail()
    .withMessage("Email Is Not Valid"),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password is Required')
    .isLength({ min: 8 })
]

router.post(
  '/api/auth/login',pipelineValidation,
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
      email,
      password,
    } = req.body;

    const existingUser = await User.findOne({ email: email })
    if (!existingUser) {
      return res.status(401).send({
        status: "error",
        message: `email is Not Found.`,
      })
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password,
    );
    if (!passwordsMatch) {
      return res.status(401).send({
        status: "error",
        message: `Invalid credentials or password`,
      })
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        ...existingUser
      },
      process.env.JWT_KEY!,
      {
        expiresIn: '12h'
      }
    );

    // Store it on session object
    req.session = {
      ...req.session,
      jwt: userJwt,
    };

    const newToken = await Authentication.create({
      userId: existingUser.id,
      token: userJwt,
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)
    });

    res.status(201)
      .send({
        status: "success",
        token: userJwt
      });
  },
);

export default router

