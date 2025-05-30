import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, ValidationPipe, Query } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { ArticlesService } from "./articles.service"
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
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(
    @Query("sortBy") sortBy?: string,
    @Query("category") category?: string,
  ) {
    console.log("findAll endpoint called with:", { sortBy, category })
    return this.articlesService.findAll(sortBy, category)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articlesService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  async create(@Body(ValidationPipe) createArticleDto: CreateArticleDto, @Request() req) {
    return this.articlesService.create(createArticleDto, req.user.userId, req.user.role)
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
