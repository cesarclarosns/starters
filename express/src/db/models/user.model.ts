import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  FilterQuery,
  QueryOptions,
} from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export type TUser = HydratedDocument<InferSchemaType<typeof userSchema>>;
export type UserFilterQuery = FilterQuery<TUser>;
export type UserQueryOptions = QueryOptions<TUser>;
export const User = model("User", userSchema, "users");
