/**
 * @file Service Schema
 * @copyright yusuf rambe, 2024
 * @version 1.0.0
 * @module library/src/models/wallet.ts
 */

import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new Service

interface ServiceAttrs {
  serviceCode: string
  serviceName: string
  serviceIcon: string
  serviceTarif: number

}

// An interface that describes the properties
// that a Service Document has
interface ServiceDoc extends ServiceAttrs, mongoose.Document {}

// An interface that describes the properties
// that a Service Model has
interface ServiceModel extends mongoose.Model<ServiceDoc> {
  build(attrs: ServiceAttrs): ServiceDoc;
}

// Mongoose Schema
const ServiceSchema = new mongoose.Schema(
  {
    serviceCode: {
      type: String
    },
    serviceName: {
      type: String
    },
		serviceIcon: {
      type: String
    },
    serviceTarif: {
      type: Number
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

ServiceSchema.statics.build = (attrs: ServiceAttrs) => {
  return new Service(attrs);
}

const Service = mongoose.model<ServiceDoc, ServiceModel>("Service", ServiceSchema)

export { Service };

