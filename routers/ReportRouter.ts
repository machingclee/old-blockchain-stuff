import * as express from "express";
import { ReportService } from "../services/ReportService";
import multer = require("multer");

export class ReportRouter {
  constructor(
    private reportService: ReportService,
    private upload: multer.Instance
  ) {}

  router() {
    const router = express.Router();
    router.get("/report_id/:report_id", this.getReportByReportId);
    router.get("/shop_id/:shop_id", this.getReportByShopId);
    router.get("/user_id/:user_id", this.getReportByUserId);
    router.put("/vote", this.voteReport);
    router.get("/issues", this.getIssueList);
    router.post("/by_issueIds", this.getReportByIssueIds);
    router.post("/", this.upload.array("photo"), this.postReport);
    return router;
  }

  private getReportByReportId = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { report_id } = req.params;
      const report = await this.reportService.getReportByReportId(report_id);
      res.json(report[0]);
    } catch (e) {
      res.json(e);
    }
  };

  private getReportByShopId = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { shop_id } = req.params;
      const user_id = req.query.userId;
      const result = await this.reportService.getFullReportByShopId(
        shop_id,
        user_id
      );
      res.json(result);
    } catch (e) {
      res.json(e);
    }
  };

  private getReportByUserId = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { user_id } = req.params;
      const reports = await this.reportService.getFullReportByUserId(user_id);
      res.json(reports);
    } catch (e) {
      res.json(e);
    }
  };

  private voteReport = async (req: express.Request, res: express.Response) => {
    try {
      const { report_id, vote, user_id } = req.body.data;
      console.log(
        `vote is ${vote}, report id is ${report_id}, user id is ${user_id}`
      );
      const result = await this.reportService.voteReport(
        report_id,
        user_id,
        vote
      );
      console.log(result);
      res.json(result);
    } catch (e) {
      res.json(e);
    }
  };

  private getIssueList = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const issues = await this.reportService.getIssueList();
      res.json(issues);
    } catch (e) {
      res.json(e);
    }
  };

  private postReport = async (req: express.Request, res: express.Response) => {
    try {
      // add to table reports
      const report_id = await this.reportService.postReport(req.body);
      // add to table report_photos
      for (let i = 0; i < req.files.length; i++) {
        await this.reportService.postReportPhoto(
          report_id[0],
          req.files[i].location
        );
      }
      // https://rinkeby.etherscan.io/tx/
      await this.reportService.postReportInsertHash(
        req.body,
        parseInt(report_id[0])
      );

      const hash = await this.reportService.getHash(report_id[0]);

      res.json({
        isSuccess: true,
        hash: hash[0]["hash"],
        reportId: report_id[0]
      });
    } catch (e) {
      res.json({ isSuccess: false, msg: e.toString() });
    }
  };

  private getReportByIssueIds = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { issueIds } = req.body;
    console.log("issueIds!:", issueIds);
    const result = await this.reportService.getReportByIssueId(issueIds);
    res.json(result);
  };
}
