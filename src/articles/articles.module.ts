import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ArticlesService } from "./articles.service"
import { ArticlesController } from "./articles.controller"
import { Article, ArticleSchema } from "./article.schema"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]), // Ensure Article model is imported
  ],
  providers: [
    ArticlesService, // Ensure ArticlesService is provided
  ],
  controllers: [
    ArticlesController, // Ensure ArticlesController is registered
  ],
  exports: [
    ArticlesService, // Export ArticlesService if used in other modules
  ],
})
export class ArticlesModule {}
