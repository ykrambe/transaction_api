/**
 * @file Wallet Schema
 * @copyright yusuf rambe, 2024
 * @version 1.0.0
 * @module library/src/models/wallet.ts
 */

import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new Wallet

interface WalletAttrs {
  userId: string
  balance: number
  currency: string
}

// An interface that describes the properties
// that a Wallet Document has
interface WalletDoc extends WalletAttrs, mongoose.Document {}

// An interface that describes the properties
// that a Wallet Model has
interface WalletModel extends mongoose.Model<WalletDoc> {
  build(attrs: WalletAttrs): WalletDoc;
}

// Mongoose Schema
const WalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    balance: {
      type: Number,
      default: 0
    },
		currency: {
      type: String,
      enum: ["IDR"],
      default: "IDR",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
		timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
)

WalletSchema.statics.build = (attrs: WalletAttrs) => {
  return new Wallet(attrs);
}

const Wallet = mongoose.model<WalletDoc, WalletModel>("Wallet", WalletSchema)

export { Wallet };

