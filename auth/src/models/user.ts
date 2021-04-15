import mongoose from "mongoose";
import { Password } from "../services/password";
// an interface that describes the properties of the user
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//interface that describes the properties a user doc has.
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// types here are specific to mongoose
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      // ret is returned obj
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        //__v is th eversion key
        delete ret.__v;
      },
    },
  }
);

// this is a middleware funct
// mongoose does not have support for async/await. instead to handle any kind of async code that we want to run inside this callback, we get this "done" argument. we are responsible for calling done, once we have done all the work we need to do inside of here. instead of waiting for mongoose to figure out to wait for the "await", we let mongoose know with done()
userSchema.pre("save", async function (next) {
  // the reason fro this is that we might be retrieving the user out of the db and tryign to save them back into the db at some future point in time.imagine we pull the email and then user again. we have to avoid hashing the hashed password.
  // when we create the user, mongoose will consider "isModified" to be true
  // "this" refers to the document
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  next();
});

//User.build({email:"",password:"adad"})- password will be considered modified

// isntead of calling "new User" we are calling this to create a new user for ts.
// Statics are pretty much the same as methods but allow for defining functions that exist directly on your Model.
// Schema Statics are methods that can be invoked directly by a Model (unlike Schema Methods, which need to be invoked by an instance of a Mongoose document). You assign a Static to a schema by adding the function to the schema's statics object.
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// UserDoc and UserModel are args to mongoose.model. instead of being data type or value, it is a type.
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
// <> is generic syntax. like functions or types.
