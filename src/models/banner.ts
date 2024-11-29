/**
 * @file Banner Schema
 * @copyright yusuf rambe, 2024
 * @version 1.0.0
 * @module library/src/models/wallet.ts
 */

import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new Banner

interface BannerAttrs {
  bannerName: string
  bannerImage: string
  description: string
}

// An interface that describes the properties
// that a Banner Document has
interface BannerDoc extends BannerAttrs, mongoose.Document {}

// An interface that describes the properties
// that a Banner Model has
interface BannerModel extends mongoose.Model<BannerDoc> {
  build(attrs: BannerAttrs): BannerDoc;
}

// Mongoose Schema
const BannerSchema = new mongoose.Schema(
  {
    bannerName: {
      type: String
    },
    bannerImage: {
      type: String
    },
		description: {
      type: String
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

BannerSchema.statics.build = (attrs: BannerAttrs) => {
  return new Banner(attrs);
}

const Banner = mongoose.model<BannerDoc, BannerModel>("Banner", BannerSchema)

export { Banner };

