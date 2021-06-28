import { UserService } from "../services/UserService";
import * as express from "express";
import * as jwtSimple from "jwt-simple";
import jwt from "../jwt";
import axios from "axios";
import { AuthService } from "../services/AuthService";

export class AuthRouter {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  router() {
    const router = express.Router();

    router.post("/login", this.login);
    router.post("/login/facebook", this.loginFacebook);
    router.post("/sign_up/", this.signUpUser);

    return router;
  }

  private signUpUser = async (req: express.Request, res: express.Response) => {
    const { username, password, email } = req.body;

    const validUsername = this.authService.usernameValidated(username);
    const validPassword = this.authService.passwordValidated(password);

    if (validUsername == false || validPassword == false) {
      res.json({
        result: null
      });
    } else {
      const existingUser = await this.userService.getUser(username);
      console.log("existing user", existingUser);
      if (existingUser == []) {
        res.json({ msg: "User already exists" });
      } else {
        const result = await this.userService.createUser(
          username,
          password,
          email
        );
        console.log("insert this result", result);
        res.json({ result: result });
      }
    }
  };

  login = async (req: express.Request, res: express.Response) => {
    if (!req.body.username || !req.body.password) {
      res.status(401).json({ msg: "Wrong Username/Password" });
      return;
    }
    const { username, password } = req.body;

    const user = await this.userService.getUser(username);
    if (user.length == 0) {
      res.status(401).json({ msg: "Wrong Username/Password" });
      return;
    } else {
      const user = await this.userService.checkUserPassword(username, password);
      if (user === false) {
        res.status(401).json({ msg: "Wrong Username/Password" });
        return;
      }

      console.log("user result: ", user);

      // Generate JWT
      const payload = {
        id: user.id,
        username: user.username
      };
      const token = jwtSimple.encode(payload, jwt.jwtSecret);

      res.json({
        token: token,
        username: user.username
      });
    }
  };

  loginFacebook = async (req: express.Request, res: express.Response) => {
    if (!req.body.accessToken) {
      res.status(401).json({ msg: "Wrong Access Token!" });
      return;
    }
    const { accessToken } = req.body;
    try {
      const result = await axios.get(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`
      );

      console.log("result: ", result.data.id);

      const returnId = await this.userService.getUserByFacebookId(
        result.data.id
      );

      let user = returnId[0];

      console.log("user: ", user);
      if (returnId.length == 0) {
        user = (await this.userService.createUserFB(
          result.data.id,
          "",
          result.data.id,
          result.data.email
        ))[0];
      }
      const payload = {
        id: user.id,
        username: user.username
      };
      const token = jwtSimple.encode(payload, jwt.jwtSecret);
      res.json({
        username: user.username,
        token: token
      });
    } catch (e) {
      console.error(e);
      res.status(401).json({ msg: "Wrong Access Token!" });
      return;
    }
  };
}
