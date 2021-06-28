import * as Knex from "knex";
import { checkPassword, hashPassword } from "./hash";

export class UserService {
  constructor(private knex: Knex) {}

  getUser = async (username: string) => {
    return await this.knex
      .select("*")
      .from("users")
      .where("username", username);
  };

  getUserById = async (id: string) => {
    return await this.knex
      .select("*")
      .from("users")
      .where("id", id);
  };

  getUserByUsername = async (username: string) => {
    let result = await this.knex
      .select("*")
      .from("users")
      .where("username", username)
      .first();
    delete result.created_at;
    delete result.updated_at;
    delete result.password;
    return result;
  };

  getUserByFacebookId = async (facebookId: string) => {
    const result = await this.knex
      .select("*")
      .from("users")
      .where("facebook_id", facebookId);
    return result;
  };

  createUser = async (username: string, password: string, email: string) => {
    const ids = await this.knex
      .insert({
        username: username,
        password: await hashPassword(password),
        email: email,
        display_name: username,
        profile_picture: "https://s3-ap-southeast-1.amazonaws.com/assets-standoverflow.com/avatar-default.jpg"
      })
      .into("users")
      .returning("id");

    return {
      id: ids[0],
      username: username
    };
  };

  createUserFB = async (
    username: string,
    password: string,
    facebook_id: string,
    email: string
  ) => {
    const ids = await this.knex
      .insert({
        username: username,
        password: await hashPassword(password),
        facebook_id: facebook_id,
        email: email,
        display_name: username,
        profile_picture: "https://s3-ap-southeast-1.amazonaws.com/assets-standoverflow.com/avatar-default.jpg"
      })
      .into("users")
      .returning("id");

    return {
      id: ids[0],
      username: username
    };
  };
  checkUserPassword = async (username: string, password: string) => {
    const user = await this.knex
      .select("*")
      .from("users")
      .where("username", username)
      .first();

    if (await checkPassword(password, user.password)) {
      return user;
    } else {
      return false;
    }
  };

  updateProfileUrl = async (username: string, location: string) => {
    return await this.knex("users")
      .update({ profile_picture: location })
      .where("username", username);
  };

  changeDisplayName = async (id: number, displayName: string) => {
    await this.knex("users")
      .update({
        display_name: displayName
      })
      .where("id", id);
  };

  changePassword = async (
    id: number,
    password: string,
    newPassword: string
  ) => {
    const user = await this.knex
      .select("*")
      .from("users")
      .where("id", id)
      .first();

    if (await checkPassword(password, user.password)) {
      await this.knex("users")
        .update({
          password: await hashPassword(newPassword)
        })
        .where("id", id);
    } else {
      throw new Error("password dose not match");
    }
  };

  listBookmark = async (id: number) => {
    return await this.knex
      .select([
        "shops.id",
        "shops.name",
        "shops.district",
        "shops.address",
        "shops.industry",
        "shops.profile_picture",
        "shops.phone"
      ])
      .from("bookmark")
      .innerJoin("shops", "shop_id", "shops.id")
      .where("user_id", id);
  };

  addBookmark = async (id: number, shopId: number): Promise<number> => {
    return await this.knex("bookmark")
      .insert({
        user_id: id,
        shop_id: shopId
      })
      .returning("id");
  };

  deleteBookmark = async (id: number, shopId: number) => {
    return await this.knex("bookmark")
      .where("user_id", id)
      .andWhere("shop_id", shopId)
      .del();
  };
}
