/**
 * @file Authentication Schema
 * @copyright yusuf rambe, 2024
 * @version 1.0.0
 * @module library/src/models/authentication.ts
 */

import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new Authentication

interface AuthenticationAttrs {
  userId: string
  token: string
  revokedAt?: Date
  expiresAt: Date
}

// An interface that describes the properties
// that a Authentication Document has
interface AuthenticationDoc extends AuthenticationAttrs, mongoose.Document {}

// An interface that describes the properties
// that a Authentication Model has
interface AuthenticationModel extends mongoose.Model<AuthenticationDoc> {
  build(attrs: AuthenticationAttrs): AuthenticationDoc;
}

// Mongoose Schema
const AuthenticationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: null
    },
		revokedAt: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
)

AuthenticationSchema.statics.build = (attrs: AuthenticationAttrs) => {
  return new Authentication(attrs);
}

const Authentication = mongoose.model<AuthenticationDoc, AuthenticationModel>("Authentication", AuthenticationSchema)

export { Authentication };

