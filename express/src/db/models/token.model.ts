import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
  FilterQuery,
  QueryOptions,
} from "mongoose";

const tokenSchema = new Schema(
  {
    token: { type: String, required: true },
    userId: { type: Schema.ObjectId, required: true },
    type: {
      type: String,
      required: true,
      enum: ["refresh_token", "csrf_token"],
    },
    expireAt: {
      type: Schema.Types.Date,
      expires: 7 * 24 * 60 * 60, // In seconds
    },
  },
  {
    timestamps: true,
  }
);

export type TToken = HydratedDocument<InferSchemaType<typeof tokenSchema>>;
export type TokenFilterQuery = FilterQuery<TToken>;
export type TokenQueryOptions = QueryOptions<TToken>;

export const Token = model("Token", tokenSchema, "tokens");
