import * as Knex from "knex";
import { hashPassword } from "../services/hash";
// import * as jsonfile from "jsonfile";
// import { ElasticsearchService } from "../services/ElasticsearchService";
// const elastcisearchservice = new ElasticsearchService();

export async function seed(knex: Knex): Promise<any> {
  await knex("shops").del();
  await knex("issues").del();
  await knex("users").del();

  await knex("users").insert([
    {
      username: "junong",
      password: await hashPassword("juno"),
      email: "juno@gmail.com",
      profile_picture:
        "https://s3-ap-southeast-1.amazonaws.com/assets-standoverflow.com/profile-1562707364240.jpeg",
      display_name: "junong"
    },
    {
      username: "tobysan",
      password: await hashPassword("toby"),
      email: "toby@gmail.com",
      profile_picture:
        "https://s3-ap-southeast-1.amazonaws.com/assets-standoverflow.com/profile-1562657684323.jpeg",
      display_name: "tobysan"
    },
    {
      username: "占士李",
      password: await hashPassword("james"),
      email: "james@gmail.com",
      profile_picture:
        "https://s3-ap-southeast-1.amazonaws.com/assets-standoverflow.com/propic_sample1.jpg",
      display_name: "占士李"
    }
  ]);

  await knex("issues").insert([
    {
      name: "Democracy Movement",
      description:
        "Wikipedia: Democratic development in Hong Kong has been a major issue since the transfer of sovereignty to China in 1997. The one country, two systems principle allows the Hong Kong government to administer all areas of government except foreign relations and (military) defence separately from the national Chinese government. Many Hong Kong citizens became concerned about democratic development when the first Chief executive of Hong Kong Tung Chee-hwa appeared to have mishandled this issue. Other democracy-related issues involving human rights and universal suffrage (in this case the right to elect Hong Kong leaders through general elections under universal suffrage with no curtailment from the central government of China) became the new focal point for the pro-democracy camp.",
      photo:
        "https://s3-ap-southeast-1.amazonaws.com/assets-standoverflow.com/hongkong_democracy_movement.jpg"
    },
    {
      name: "Police Abuse of Power",
      description:
        "Wikipedia: In the anti-extradition bill protests in June 2019, police are criticised for using excessive force. On 12 June, they have fired 150 tear gas rounds, 20 beanbag shots, several rubber bullets and smoke bombs on protesters outside the Legislative Council complex. Commissioner of Police Stephen Lo dismisses those complaints, stating that 22 officers were hurt during the protest and suitable force was used.",
      photo:
        "https://s3-ap-southeast-1.amazonaws.com/assets-standoverflow.com/riot_police.jpg"
    },
    {
      name: "Environmental Protection",
      description:
        "Environmental protection is the practice of protecting the natural environment by individuals, organizations and governments. Its objectives are to conserve natural resources and the existing natural environment and, where possible, to repair damage and reverse trends.",
      photo:
        "https://s3-ap-southeast-1.amazonaws.com/assets-standoverflow.com/issues_environment.jpg"
    }
  ]);

  await knex("shops").insert([
    {
      name: "Tecky Academy",
      district: "Tsuen Wan",
      address: "One Midtown, 2715-16, 27/F, 11 Hoi Shing Rd, Tsuen Wan",
      industry: "Education",
      phone: "9725 6400",
      profile_picture:
        "https://s3-ap-southeast-1.amazonaws.com/assets-standoverflow.com/tecky_logo.png"
    }
  ]);

  // "name": "Cake's Secrets 詩餅坊",
  // "district": "Western District",
  // "address": "G/F, 43 Hau Wo Street, Kennedy Town",
  // "phone": "28166000",
  // "picture": "https://static5.orstatic.com/userphoto/photo/4/3R4/00QOTKF9C480419344DF1Dpx.jpg",
  // "open": "11:00",
  // "close": "21:00"

  // const shopData: any = await jsonfile.readFile(
  //   __dirname + "/combined_result.json"
  // );
  // for (let x of shopData) {
  //   const id = await knex("shops")
  //     .insert({
  //       name: x.name,
  //       district: x.district,
  //       address: x.address,
  //       phone: x.phone,
  //       profile_picture: x.picture,
  //       open: x.open,
  //       close: x.close
  //     })
  //     .returning("id");

  //   await elastcisearchservice.createRecord("shops", "stores", {
  //     id: id[0],
  //     name: x.name,
  //     district: x.district,
  //     address: x.address,
  //     phone: x.phone,
  //     profile_picture: x.picture,
  //     open: x.open,
  //     close: x.close
  //   });
  // }
}
