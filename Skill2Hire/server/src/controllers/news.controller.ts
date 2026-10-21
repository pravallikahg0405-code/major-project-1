import { Request, Response } from 'express';
import { NewsSummaryService } from '../services/newsSummaryService';

export class NewsController {
  /**
   * Fetch Tech News Articles by Category (100% Public)
   */
  public static async getFeed(req: Request, res: Response): Promise<void> {
    try {
      const category = (req.query.category as string) || 'All';
      const articles = await NewsSummaryService.getLatestTechNews(category);
      res.status(200).json({
        success: true,
        data: articles
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get Single Article Details with AI Summary (100% Public)
   */
  public static async getArticleById(req: Request, res: Response): Promise<void> {
    try {
      const articles = await NewsSummaryService.getLatestTechNews('All');
      const article = articles.find(a => a.id === req.params.id);

      if (!article) {
        res.status(404).json({ success: false, error: 'Article not found.' });
        return;
      }

      res.status(200).json({ success: true, data: article });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
