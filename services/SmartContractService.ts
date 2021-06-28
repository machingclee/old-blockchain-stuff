import { default as Web3 } from "web3";
import * as Knex from "knex";

export class SmartContractService {
  public privateKey: string;
  public account: any;
  public contractAddress: string;
  public reviewsContract: any;

  constructor(private knex: Knex, private web3: Web3) {
    this.knex;
    this.privateKey =
    // [CODE REVIEW] 🤦🏻‍♂️
      "C62D3D048C3FC4F5B8491F587D166DFCAC06D4E694D5A90169DF18C07DC5C4AA";

    this.account = this.web3.eth.accounts.privateKeyToAccount(
      "0x" + this.privateKey
    );
    this.web3.eth.accounts.wallet.add(this.account);
    this.web3.eth.defaultAccount = this.account.address;
    this.contractAddress = "0xc775d626004936c7D209657d6e602Fd892Ea2877";
    this.reviewsContract = new this.web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [
            {
              name: "_supportTheIssue",
              type: "bool"
            },
            {
              name: "_issue_title",
              type: "string"
            },
            {
              name: "_review_title",
              type: "string"
            },
            {
              name: "_content",
              type: "string"
            }
          ],
          name: "addIssue",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          constant: false,
          inputs: [
            {
              name: "_reviewId",
              type: "uint256"
            }
          ],
          name: "dislike",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          constant: true,
          inputs: [],
          name: "reviewsCount",
          outputs: [
            {
              name: "",
              type: "uint256"
            }
          ],
          payable: false,
          stateMutability: "view",
          type: "function"
        },
        {
          constant: false,
          inputs: [
            {
              name: "_reviewId",
              type: "uint256"
            }
          ],
          name: "like",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          constant: true,
          inputs: [
            {
              name: "",
              type: "uint256"
            }
          ],
          name: "reviews",
          outputs: [
            {
              name: "id",
              type: "uint256"
            },
            {
              name: "supportTheIssue",
              type: "bool"
            },
            {
              name: "like",
              type: "uint256"
            },
            {
              name: "dislike",
              type: "uint256"
            },
            {
              name: "issueTitle",
              type: "string"
            },
            {
              name: "title",
              type: "string"
            },
            {
              name: "content",
              type: "string"
            }
          ],
          payable: false,
          stateMutability: "view",
          type: "function"
        }
      ],
      this.contractAddress
    );
  }

  likeReview = (n: number) =>
    new Promise((resolve, reject) => {
      this.reviewsContract.methods.like(n).send(
        {
          from: this.web3.defaultAccount,
          gasLimit: this.web3.utils.toHex(160000),
          gasPrice: this.web3.utils.toHex(this.web3.utils.toWei("1", "gwei"))
        },
        (err: string, hash: string) => {
          resolve(hash);
        }
      );
    });

  dislikeReview = (n: number) =>
    new Promise(async (resolve, reject) => {
      this.reviewsContract.methods.dislike(n).send(
        {
          from: this.web3.defaultAccount,
          gasLimit: this.web3.utils.toHex(160000),
          gasPrice: this.web3.utils.toHex(this.web3.utils.toWei("1", "gwei"))
        },
        (err: string, hash: string) => {
          resolve(hash);
        }
      );
    });

  fetchReview = async () => {
    const promises = [];
    const fetchedResult: any[] = [];
    for (let i = 1; i <= (await this.totalReview()); i++) {
      promises.push(
        new Promise(async (resolve, reject) => {
          const response = await this.reviewsContract.methods.reviews(i).call();
          for (let i = 0; i <= 6; i++) {
            delete response[`${i}`];
          }
          for (let index in response) {
            response[index] =
              response[index].constructor.name == "BigNumber"
                ? response[index].toNumber()
                : response[index];
          }
          console.log(response);
          fetchedResult.push(response);
          resolve(true);
        })
      );
    }
    const result = Promise.all(promises).then(() => {
      return fetchedResult;
    });
    return result;
  };

  totalReview = async () => {
    const totalcount = await this.reviewsContract.methods.reviewsCount().call();
    return totalcount.toNumber();
  };

  addReview = async (
    supportTheIssue: boolean,
    issueTitle: string,
    reviewTitle: string,
    content: string
  ): Promise<string> =>
    new Promise((resolve, reject) => {
      this.reviewsContract.methods
        .addIssue(supportTheIssue, issueTitle, reviewTitle, content)
        .send(
          {
            from: this.web3.defaultAccount,
            gasLimit: this.web3.utils.toHex(160000),
            gasPrice: this.web3.utils.toHex(this.web3.utils.toWei("30", "gwei"))
          },
          (err: string, hash: string) => {
            resolve(hash);
          }
        );
    });
}
