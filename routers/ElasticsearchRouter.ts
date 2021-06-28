import * as express from "express";
import { ElasticsearchService } from "../services/ElasticsearchService";

export class ElasticsearchRouter {
  constructor(private elasticsearchService: ElasticsearchService) {}

  router() {
    const router = express.Router();
    router.post("/match", this.matchRecord);
    return router;
  }

  matchRecord = async (req: express.Request, res: express.Response) => {
    const { index, filter } = req.body;

    const result = await this.elasticsearchService.matchRecordAnd(
      index,
      filter
    );
    console.log("response result:", result);
    res.json(result);
  };
  //this returns an object {total:??, hits: ??},

  //where total is the total number of matching results, and hits is the matching results represented as an array of objects.

  //we use, for exmaple, hits[0].id to point to the report.
}
