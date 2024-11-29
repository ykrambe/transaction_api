import { Authentication } from "../models/authentication";
import jwt from 'jsonwebtoken';

async function validateSessions(token:string) {
  const now = new Date().getTime();
  const tokenRecord = await Authentication.findOne({ token: token });
  if (!tokenRecord || tokenRecord.revokedAt || new Date(tokenRecord.expiresAt).getTime() < now) {
    return false;
  }
  // const decode = jwt.verify(token, process.env.JWT_KEY!)
  return true;
}

async function closeSession (token:string) {
  const session = await Authentication.findOne({ token: token });
  if (!session || session.revokedAt) {
    return false
  }
  session.set({
    ...session,
    revokedAt: new Date()
  })
  await session.save()
  
  return true
}

export {validateSessions, closeSession}