import * as express from "express";
import { SmartContractService } from "../services/SmartContractService";

export class SmartContractRouter {
  constructor(private smartContractService: SmartContractService) {}
  router() {
    const router = express.Router();
    router.get("/fetch_reviews", this.fetchReview);
    router.get("/review/like/:review_id", this.likeReview);
    router.get("/review/dislike/:review_id", this.dislikeReview);
    router.post("/review/create_review", this.addReview);
    return router;
  }

  fetchReview = async (req: express.Request, res: express.Response) => {
    const result = await this.smartContractService.fetchReview();
    res.json(result);
  };

  likeReview = async (req: express.Request, res: express.Response) => {
    const result = await this.smartContractService.likeReview(
      req.params["review_id"]
    );
    if (!result) {
      res.json({ msg: "try again later" });
    } else {
      res.json({ "hash result": result });
    }
  };

  dislikeReview = async (req: express.Request, res: express.Response) => {
    const result = await this.smartContractService.dislikeReview(
      req.params["review_id"]
    );
    if (!result) {
      res.json({ msg: "try again later" });
    } else {
      res.json({ "hash result": result });
    }
  };

  addReview = async (req: express.Request, res: express.Response) => {
    console.log(req.body);
    const { supportTheIssue, issueTitle, reviewTitle, content } = req.body;
    const result = await this.smartContractService.addReview(
      supportTheIssue,
      issueTitle,
      reviewTitle,
      content
    );
    res.json(result);
  };
}
