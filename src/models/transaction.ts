/**
 * @file Transaction Schema
 * @copyright yusuf rambe, 2024
 * @version 1.0.0
 * @module library/src/models/transaction.ts
 */

import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new Transaction

interface TransactionAttrs {
  userId: string
  invoiceNumber: number
  transactionType: string
  totalAmount: number
  description: string
  serviceCode: string
}

// An interface that describes the properties
// that a Transaction Document has
interface TransactionDoc extends TransactionAttrs, mongoose.Document {}

// An interface that describes the properties
// that a Transaction Model has
interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
}

// Mongoose Schema
const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    invoiceNumber: {
      type: String
    },
    transactionType: {
      type: String,
      enum: ["TOPUP", "PAYMENT"],
    },
		totalAmount: {
      type: Number
    },
    description: {
      type: String,
      default: "",
    },
    serviceCode: {
      type: String,
      default: null,
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

TransactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
}

const Transaction = mongoose.model<TransactionDoc, TransactionModel>("Transaction", TransactionSchema)

export { Transaction };

