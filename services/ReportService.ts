import * as Knex from "knex";
import * as moment from "moment";
import { SmartContractService } from "./SmartContractService";

export class ReportService {
  constructor(
    private knex: Knex,
    private smartContractService: SmartContractService
  ) {}

  getReportByReportId = async (report_id: string) => {
    return await this.knex
      .select("*")
      .from("reports")
      .where("id", report_id);
  };

  getFullReportByShopId = async (shop_id: string, user_id: string) => {
    const reports = await this.getReportByShopId(shop_id);
    let result = [];
    for (let report of reports) {
      const item = report; // [CODE REVIEW] this line did nothing. If you wish to clone, use Object.assign({}, report)
      const photos = await this.getReportPhotosByReportId(report.id);
      let photoList = [];
      for (let photo of photos) {
        let item = {}; // [CODE REVIEW] so bad to re use same variable name
        item["src"] = photo["photo"];
        item["thumbnail"] = photo["photo"];
        photoList.push(item);
      }
      item["photos"] = photoList; // [CODE REVIEW] Use .map()
      const userInfo = await this.getReportUserInfoByUserId(report.user_id);
      item["user_info"] = userInfo[0];
      const shopInfo = await this.getReportShopInfoByReportId(shop_id);
      item["shop_info"] = shopInfo[0];
      item["created_at"] = moment(item["created_at"]).format("MMMM DD, YYYY");
      // [CODE REVIEW] Use JOIN better
      const like = await this.getReportPopularityByReportId(
        report.id,
        "like",
        true
      );
      const dislike = await this.getReportPopularityByReportId(
        report.id,
        "dislike",
        true
      );
      item["like"] = like;
      item["dislike"] = dislike;
      const reportVotes = await this.getReportVotedStatus(report.id, user_id);
      const reportVoted = reportVotes.length > 0 ? true : false;
      item["reportVoted"] = reportVoted;
      result.push(item);
    }
    return result;
  };

  getReportVotedStatus = async (report_id: string, user_id: string) => {
    return await this.knex
      .select("*")
      .from("report_popularity")
      .whereRaw(`report_id = ${report_id} and user_id = ${user_id}`); // [CODE REVIEW] WHAT THE HELL!!!!
    /*
      .where("report_id", report_id)
      .where("user_id", user_id)
      */
  };

  getReportByShopId = async (shop_id: string) => {
    let reports = await this.knex
      .select("*")
      .from("reports")
      .where("shop_id", shop_id);
    return reports;
  };

  getReportPhotosByReportId = async (report_id: string) => {
    return await this.knex
      .select("photo")
      .from("report_photos")
      .where("report_id", report_id);
  };

  getReportUserInfoByUserId = async (user_id: string) => {
    return await this.knex
      .select("display_name", "profile_picture")
      .from("users")
      .where("id", user_id);
  };

  getReportShopInfoByReportId = async (shop_id: string) => {
    return await this.knex
      .select("name", "profile_picture")
      .from("shops")
      .where("id", shop_id);
  };

  getReportPopularityByReportId = async (
    report_id: string,
    popularity: string,
    state: boolean
  ) => {
    const list = await this.knex
      .select("*")
      .from("report_popularity")
      .where(popularity, state)
      .andWhere("report_id", report_id);
    return list.length;
  };

  getFullReportByUserId = async (user_id: string) => {
    const reports = await this.getReportByUserId(user_id);
    let result = [];
    for (let report of reports) {
      const item = report;
      const photos = await this.getReportPhotosByReportId(report.id);
      let photoList = [];
      for (let photo of photos) {
        let item = {};
        item["src"] = photo["photo"];
        item["thumbnail"] = photo["photo"];
        photoList.push(item);
      }
      item["photos"] = photoList;
      const userInfo = await this.getReportUserInfoByUserId(user_id);
      item["user_info"] = userInfo[0];
      const shopInfo = await this.getReportShopInfoByReportId(report.shop_id);
      item["shop_info"] = shopInfo[0];
      item["created_at"] = moment(item["created_at"]).format("MMMM DD, YYYY");
      const like = await this.getReportPopularityByReportId(
        report.id,
        "like",
        true
      );
      const dislike = await this.getReportPopularityByReportId(
        report.id,
        "dislike",
        true
      );
      item["like"] = like;
      item["dislike"] = dislike;
      const reportVotes = await this.getReportVotedStatus(report.id, user_id);
      const reportVoted = reportVotes.length > 0 ? true : false;
      item["reportVoted"] = reportVoted;
      result.push(item);
    }
    return result;
  };

  getReportByUserId = async (user_id: string) => {
    let reports = await this.knex
      .select("*")
      .from("reports")
      .where("user_id", user_id);
    return reports;
  };

  voteReport = async (report_id: string, user_id: string, vote: string) => {
    if (vote === "like") {
      return await this.knex
        .insert({
          report_id: report_id,
          user_id: user_id,
          like: "1",
          dislike: "0"
        })
        .into("report_popularity")
        .returning("id");
    }

    if (vote === "dislike") {
      return await this.knex
        .insert({
          report_id: report_id,
          user_id: user_id,
          like: "0",
          dislike: "1"
        })
        .into("report_popularity")
        .returning("id");
    }

    return console.log("error"); // throw new error
  };

  getIssueList = async () => {
    return await this.knex.select("*").from("issues");
  };

  getIssueListByIssueId = async (issueId: string) => {
    return await this.knex
      .select("*")
      .from("issues")
      .where("id", parseInt(issueId));
  };

  postReportInsertHash = async (reqBody: object, reportId: number) => {
    const supportTheIssue = reqBody["stand"] === "Oppose" ? false : true;
    const issueId = reqBody["issue_id"];
    const reviewTitle = reqBody["title"];
    const content = reqBody["content"];
    console.log("issue id here", issueId);

    console.log(typeof issueId, issueId);

    const issueTitle = (await this.getIssueListByIssueId(issueId))[0].name;

    console.log("issue title", issueTitle);

    const transactionHash: string = await this.smartContractService.addReview(
      supportTheIssue,
      issueTitle,
      reviewTitle,
      content
    );

    console.log("transaction Hash", transactionHash);
    console.log("type of transactionHash", typeof transactionHash);

    await this.knex("reports")
      .update({ hash: transactionHash })
      .where("id", reportId);

    return;
  };

  postReport = async (report: object) => {
    const id = await this.knex
      .insert({
        title: report["title"],
        content: report["content"],
        stand: report["stand"] === "Support" ? "1" : "0",
        issue_id: report["issue_id"].toString(),
        user_id: report["user_id"],
        shop_id: report["shop_id"]
      })
      .into("reports")
      .returning("id");
    return id;
  };

  postReportPhoto = async (report_id: string, url: string) => {
    return await this.knex
      .insert({
        photo: url,
        report_id: report_id
      })
      .into("report_photos")
      .returning("photo");
  };

  getReportByIssueId = async (issueIds: number[]) => {
    let reportsContainer: any[] = [];
    for (let issueId of issueIds) {
      const result = await this.knex
        .select("*", "issues.name as issue_name")
        .from("reports")
        .innerJoin("issues", "reports.issue_id", "issues.id")
        .where("issue_id", issueId);
      reportsContainer = reportsContainer.concat(result);
    }
    console.log("total number of reports:", reportsContainer);
    return reportsContainer;
  };

  getHash = async (report_id: string) => {
    return await this.knex
      .select("hash")
      .from("reports")
      .where("id", report_id);
  };
}
