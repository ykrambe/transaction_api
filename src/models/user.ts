/**
 * @file User Schema
 * @copyright yusuf rambe, 2024
 * @version 1.0.0
 * @module library/src/models/user.ts
 */

import mongoose from "mongoose";
import { Password } from "../utils/password";

// An interface that describes the properties
// that are required to create a new User

interface UserAttrs {
  firstName: string
  lastName: string
  email: string
  password: string
  profileImage?: string
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends UserAttrs, mongoose.Document {}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Mongoose Schema
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,

    },
		email: {
      type: String,
      trim: true,
      required: true,
    },
		password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: ""
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

UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  if (this.isModified('firstName')) {
    const firstName: string = this.get('firstName')
    this.set('firstName', firstName.toLowerCase());
  }
  if (this.isModified('lastName')) {
    const lastName: string = this.get('lastName')
    this.set('lastName', lastName.toLowerCase());
  }
  done()
})

UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema)

export { User };

