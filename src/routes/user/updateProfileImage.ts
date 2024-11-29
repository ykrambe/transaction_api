/**
 * @swagger
 * /api/user/profile/image:
 *   put:
 *     tags:
 *       - Module Profile
 *     summary: update user profile Image
 *     description: update user profile Image
 *     security:
 *      - bearerAuth: []
 *     requestBody: 
 *      content: 
 *        multipart/form-data: 
 *          schema: 
 *            type: object
 *            properties:
 *              profileImage:
 *                type: string
 *                format: binary
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
import { supabase } from "../../utils/supabaseClient";
import { upload } from "../../utils/uploadImage";

const router = express.Router();

router.put(
  "/api/user/profile/image", 
  upload.single('profileImage'),
  async (req: Request, res: Response) => {
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
    const getUser = await User.findById(userId)
    if (!getUser) {
      return res.status(404).send({
        status: "error",
        message: `user with id ${req.params.id} not found`,
      })
    }

    // getUser.set({
    //   profileImage: ""
    // })

    const file = req.file;
    if (!file) {
      return res.status(400).send({ error: 'No file uploaded' });
    }

    const { buffer, originalname } = file;
    const timestamp = Date.now();
    const fileName = `${timestamp}-${originalname}`;


    try {
      const { data, error } = await supabase.storage
        .from('ImageUpload')
        .upload(`public/profile-images/${fileName}`, buffer, { contentType: file.mimetype });
  
      if (error) {
        throw error;
      }
  
      const { data: publicUrlData } = supabase.storage
        .from('ImageUpload')
        .getPublicUrl(`public/profile-images/${fileName}`);

      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        return res.status(500).send({ error: 'Failed to generate public URL' });
      }

      getUser.set({
        profileImage: publicUrl
      })

      await getUser.save();

      getUser.set({
        password: null
      })
  
      res.status(201).send({ 
        status: "success",
        message: "User Successfully updated !",
        data: getUser,
      });
    } catch (error: any) {
      return res.status(500).send({ 
        message: "Something went wrong",
        error: error.message 
      });
    }
  }
);

export default router
