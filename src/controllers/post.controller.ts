import { Request, Response } from "express"
import cloudinary from "../config/cloudinary"
import { Post } from "../models/Post"
import { AuthRequest } from "../middleware/auth"

export const savePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { title, content, tags } = req.body
    let imageURL = ""

    if (req.file) {
      const result: any = await new Promise((resole, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (error, result) => {
            if (error) {
              console.error(error)
              return reject(error)
            }
            resole(result) // success return
          }
        )
        upload_stream.end(req.file?.buffer)
      })
      imageURL = result.secure_url
    }
    // "one,two,tree"
    const newPost = new Post({
      title,
      content,
      tags: tags.split(","),
      imageURL,
      author: req.user.sub // from auth middleware
    })
    await newPost.save()

    res.status(201).json({
      message: "Post created",
      data: newPost
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Fail to save post" })
  }
}

// GET http://localhost:5000/api/v1/post?page=1&limit=10
// GET http://localhost:5000/api/v1/post?page=1&limit=2
export const getAllPost = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find()
      .populate("author", "email") // related model data
      .sort({ createdAt: -1 }) // desc order
      .skip(skip) // ignore data for pagination
      .limit(limit) // data count for currently need
    const total = await Post.countDocuments()

    res.status(200).json({
      message: "Posts data",
      data: posts,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Fail to fetch post" })
  }
}

export const getMyPost = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const posts = await Post.find({ author: req.user.sub })
      .sort({ createdAt: -1 }) // desc order
      .skip(skip) // ignore data for pagination
      .limit(limit) // data count for currently need
      
    const total = await Post.countDocuments()

    res.status(200).json({
      message: "Posts data",
      data: posts,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Fail to fetch post" })
  }
}
