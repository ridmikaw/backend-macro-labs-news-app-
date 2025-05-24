import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ValidationPipe } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import type { ArticlesService } from "./articles.service"
import { ArticleCategory } from "./article.schema"
import { IsString, IsEnum, IsOptional, IsArray } from "class-validator"

class CreateArticleDto {
  @IsString()
  title: string

  @IsString()
  content: string

  @IsString()
  summary: string

  @IsEnum(ArticleCategory)
  category: ArticleCategory

  @IsOptional()
  @IsString()
  imageUrl?: string

  @IsOptional()
  @IsArray()
  tags?: string[]
}

@Controller("articles")
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  async findAll(sortBy?: string, category?: ArticleCategory) {
    return this.articlesService.findAll(sortBy, category)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articlesService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  async create(@Body(ValidationPipe) createArticleDto: CreateArticleDto, @Request() req) {
    return this.articlesService.create(createArticleDto, req.user.userId)
  }

  @Put(":id")
  @UseGuards(AuthGuard("jwt"))
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateArticleDto: Partial<CreateArticleDto>,
    @Request() req,
  ) {
    return this.articlesService.update(id, updateArticleDto, req.user.userId, req.user.role)
  }

  @Delete(":id")
  @UseGuards(AuthGuard("jwt"))
  async delete(@Param('id') id: string, @Request() req) {
    await this.articlesService.delete(id, req.user.userId, req.user.role)
    return { message: "Article deleted successfully" }
  }

  @Post(':id/like')
  async likeArticle(@Param('id') id: string) {
    return this.articlesService.likeArticle(id);
  }
}
