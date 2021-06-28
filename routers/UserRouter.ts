import * as express from "express";
import { UserService } from "../services/UserService";
import multer = require("multer");

export class UserRouter {
  constructor(
    private userService: UserService,
    private upload: multer.Instance
  ) {}

  router() {
    const router = express.Router();

    router.get("/", this.getCurrentUser);
    router.get("/me", this.getUserByUsername);
    router.post("/profile", this.upload.single("profile"), this.uploadProfile);
    router.post("/displayName", this.changeDisplayName);
    router.post("/password", this.changePassword);
    router.get("/bookmark", this.listBookmark);
    router.post("/bookmark", this.addBookmark);
    router.delete("/bookmark/:shopId", this.deleteBookmark);

    return router;
  }

  private getCurrentUser = async (
    req: express.Request,
    res: express.Response
  ) => {
    res.json(req.user);
  };

  private getUserByUsername = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const result = await this.userService.getUserByUsername(
        req.user.username
      );
      res.json(result);
    } catch (e) {
      res.json({ isSuccess: false, msg: e.toString() });
    }
  };

  private uploadProfile = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const username = req.body.username;
      await this.userService.updateProfileUrl(
        username,
        (req.file as any).location
      );
      res.json({ isSuccess: true, url: (req.file as any).location });
    } catch (e) {
      res.json({ isSuccess: false, msg: e.toString() });
    }
  };

  private changeDisplayName = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      await this.userService.changeDisplayName(
        req.user.id,
        req.body.displayName
      );
      res.json({ isSuccess: true });
    } catch (e) {
      res.json({ isSuccess: false, msg: e.toString() });
    }
  };

  private changePassword = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      await this.userService.changePassword(
        req.user.id,
        req.body.password,
        req.body.newPassword
      );
      res.json({ isSuccess: true });
    } catch (e) {
      res.json({ isSuccess: false, msg: e.toString() });
    }
  };

  private listBookmark = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      res.json(await this.userService.listBookmark(req.user.id));
    } catch (e) {
      res.json({ isSuccess: false, msg: e.toString() });
    }
  };

  private addBookmark = async (req: express.Request, res: express.Response) => {
    try {
      const id = await this.userService.addBookmark(
        req.user.id,
        req.body.shopId
      );
      res.json({ isSuccess: true, result: id });
    } catch (e) {
      res.json({ isSuccess: false, msg: e.toString() });
    }
  };

  private deleteBookmark = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { shopId } = req.params;
      // const shopId = req.params.shopId;

      await this.userService.deleteBookmark(req.user.id, shopId);
      res.json({ isSuccess: true });
    } catch (e) {
      res.json({ isSuccess: false, msg: e.toString() });
    }
  };
}
