import * as express from "express";
import { ShopService } from "../services/ShopService";

export class ShopRouter {
  constructor(private ShopService: ShopService) {}

  router() {
    const router = express.Router();
    router.get("/id/:shopId", this.getShopById);
    router.get("/name/:shopName", this.getShopByShopName);
    router.get("/all_by_issueIds", this.getShopsByIssueIds);
    router.put("/bookmark", this.addBookmark);
    return router;
  }

  private getShopById = async (req: express.Request, res: express.Response) => {
    try {
      const { shopId } = req.params;
      const { userId } = req.query;
      console.log(`shopid is ${shopId}`);
      console.log(`userId is ${userId}`);
      const shop = await this.ShopService.getFullShopById(shopId);
      console.log(shop);
      const bookmark = await this.ShopService.isBookmarked(shopId, userId);
      console.log(bookmark);
      if (bookmark.length > 0) {
        shop[0]["bookmarked"] = true;
      } else {
        shop[0]["bookmarked"] = false;
      }
      res.json(shop[0]);
    } catch (e) {
      console.log(e);
      res.json({ isSuccess: false, msg: e.toString() });
    }
  };

  private getShopsByIssueIds = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const result = await this.ShopService.getShopsByIssueIds();
      res.json(result);
    } catch (e) {
      console.log(e);
      res.json({ err: e.toString() });
    }
  };

  private getShopByShopName = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { shopName } = req.params;
      const shop = await this.ShopService.getShopByShopName(shopName);
      res.json(shop);
    } catch (e) {
      console.log(e);
      res.json({ isSuccess: false, msg: e.toString() });
    }
  };

  private addBookmark = async (req: express.Request, res: express.Response) => {
    try {
      const { user_id, shop_id } = req.body.data;
      const status = await this.ShopService.addBookmark(user_id, shop_id);
      res.json(status[0]);
    } catch (e) {
      console.log(e);
      res.json({ isSuccess: false, msg: e.toString() });
    }
  };
}
