import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type ArticleDocument = Article & Document

export enum ArticleCategory {
  SPORTS = "sports",
  BUSINESS = "business",
  ENTERTAINMENT = "entertainment",
  TECHNOLOGY = "technology",
  POLITICS = "politics",
  HEALTH = "health",
}

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  content: string

  @Prop({ required: true })
  summary: string

  @Prop({ enum: ArticleCategory, required: true })
  category: ArticleCategory

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  author: Types.ObjectId

  @Prop({ default: 0 })
  views: number

  @Prop({ default: 0 })
  likes: number

  @Prop({ default: true })
  isPublished: boolean

  @Prop()
  imageUrl?: string

  @Prop([String])
  tags: string[]
}

export const ArticleSchema = SchemaFactory.createForClass(Article)
