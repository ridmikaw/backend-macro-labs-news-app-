import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import type { Model } from "mongoose"
import type { Article, ArticleDocument, ArticleCategory } from "./article.schema"
import { UserRole } from "../users/user.schema"

@Injectable()
export class ArticlesService {
  private articleModel: Model<ArticleDocument>

  constructor(articleModel: Model<ArticleDocument>) {
    this.articleModel = articleModel
  }

  async create(articleData: Partial<Article>, userId: string): Promise<Article> {
    const article = new this.articleModel({
      ...articleData,
      author: userId,
    })
    return article.save()
  }

  async findAll(sortBy = "createdAt", category?: ArticleCategory): Promise<Article[]> {
    const query = category ? { category, isPublished: true } : { isPublished: true }
    const sortOptions: any = {}

    switch (sortBy) {
      case "popularity":
        sortOptions.views = -1
        break
      case "likes":
        sortOptions.likes = -1
        break
      default:
        sortOptions.createdAt = -1
    }

    return this.articleModel.find(query).populate("author", "username").sort(sortOptions).exec()
  }

  async findById(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).populate("author", "username").exec()

    if (!article) {
      throw new NotFoundException("Article not found")
    }

    // Increment views
    await this.articleModel.findByIdAndUpdate(id, { $inc: { views: 1 } })

    return article
  }

  async update(id: string, updateData: Partial<Article>, userId: string, userRole: UserRole): Promise<Article> {
    const article = await this.articleModel.findById(id)

    if (!article) {
      throw new NotFoundException("Article not found")
    }

    // Check permissions
    if (userRole !== UserRole.ADMIN && article.author.toString() !== userId) {
      throw new ForbiddenException("You can only edit your own articles")
    }

    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("author", "username")
      .exec()

    if (!updatedArticle) {
      throw new NotFoundException("Failed to update article")
    }

    return updatedArticle
  }

  async delete(id: string, userId: string, userRole: UserRole): Promise<void> {
    const article = await this.articleModel.findById(id)

    if (!article) {
      throw new NotFoundException("Article not found")
    }

    // Check permissions
    if (userRole !== UserRole.ADMIN && article.author.toString() !== userId) {
      throw new ForbiddenException("You can only delete your own articles")
    }

    const deletedArticle = await this.articleModel.findByIdAndDelete(id)

    if (!deletedArticle) {
      throw new NotFoundException("Failed to delete article")
    }
  }

  async likeArticle(id: string): Promise<Article> {
    const likedArticle = await this.articleModel
      .findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true })
      .populate("author", "username")
      .exec()

    if (!likedArticle) {
      throw new NotFoundException("Article not found")
    }

    return likedArticle
  }
}
