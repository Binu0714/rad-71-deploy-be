import mongoose, { Document, Schema } from "mongoose"

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  content: string
  tags: string[]
  imageURL: string
  author: mongoose.Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String] },
    imageURL: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    timestamps: true
  }
)

export const Post = mongoose.model<IPost>("Post", PostSchema)
