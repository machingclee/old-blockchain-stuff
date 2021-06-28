import * as Knex from "knex";

export class ShopService {
  constructor(private knex: Knex) {}

  getFullShopById = async (shopId: string) => {
    return this.knex
      .select("*")
      .from("shops")
      .where("id", shopId);
  };

  isBookmarked =  async (shopId: string, user_id:string) => {
    return this.knex
      .select("*")
      .from("bookmark")
      .whereRaw(`shop_id = ${shopId} AND user_id = ${user_id}`);
  };

  getShopsByIssueIds = async () => {
    const result = await this.knex
      .select([
        "issues.id",
        "issues.name as issue_name",
        "shops.name",
        "shops.district",
        "shops.address",
        "shops.profile_picture",
        "shops.phone",
        "shops.phone",
        "shop_id"
      ])
      .from("reports")
      .innerJoin("shops", "reports.shop_id", "shops.id")
      .innerJoin("issues", "issues.id", "reports.issue_id");
      // [CODE REVIEW] .groupBy("shops.shop_id", "issues.id")
    const indexOfUniqueResult: number[] = [];
    //unique in terms of shops, remove repeated shops
    const Ids = result.map(x => x.shop_id);

    // [CODE REVIEW] Array.from(new Set<number>(Ids))
    Ids.forEach((x, i) => {
      if (i == Ids.indexOf(x)) {
        indexOfUniqueResult.push(i);
      }
    });
    const filteredResult = indexOfUniqueResult.map(x => result[x]);

    return filteredResult;
  };

  getShopByShopName = async (shopName: string) => {
    return this.knex
      .select("*")
      .from("shops")
      .where("name", shopName);
  };

  addBookmark = async (user_id: string, shop_id: string) => {
    return await this.knex
      .insert({
        user_id: user_id,
        shop_id: shop_id
      })
      .into("bookmark")
      .returning("id");
  };
}
