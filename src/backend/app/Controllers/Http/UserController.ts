import { generatePasswordHash, verifyPassword } from "App/utils/helpers";
import { User } from "Database/entities/user";
import { Response, Request } from "express";

export default class UserController {
  static async users(request: Request, response: Response) {
    try {
      const users = await User.find();
      return response
        .status(200)
        .json({ message: "Getting users success.", data: users});
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error in getting users", error});
    }
  }

  static async get_user(request: Request, response: Response) {
    const { user_id } = request.body;
    try {
      const user = await User.findOneBy({ user_id });
      if (!user) {
        throw new Error("User not found!");
      }
      return response
        .status(200)
        .json({message: "Success in getting the user", data: user});
    } catch (error) {
      return response
        .status(500)
        .json({ message: "Error in getting the user.", error });
    }
  }

  static async create_user(request: Request, response: Response) {
    let { user_username, user_email, user_password } = request.body;

    try {
      const sameUsername = await User.findOneBy({ user_username });
      if (sameUsername) {
        throw new Error("Username already exists!");
      }
      const sameEmail = await User.findOneBy({ user_email });
      if (sameEmail) {
        throw new Error("Email already exists!");
      }

      const user = new User();
      user.user_username = user_username;
      user.user_email = user_email;
      const password = generatePasswordHash(user_password);
      user.user_password = password.hash;
      user.user_salt = password.salt;
      user.classes = [];

      await User.insert(user);
      return response
        .status(201)
        .json({ message: "User has been created!" });
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error in creating the user.", error });
    }
  }

  static async update_user(request: Request, response: Response) {
    let { user_id, user_username, user_email, user_password } = request.body;

    try {
      const user = await User.findOneBy({ user_id });

      if (!user) {
        throw new Error("User not found!");
      }
      if (user_password){
        const password = generatePasswordHash(user_password)
        user_password = password.hash;
        const user_salt = password.salt;
        await User.update(
          { user_id },
          { user_username, user_email, user_password, user_salt }
        );
      } else {
        await User.update(
          { user_id },
          { user_username, user_email}
        );
      }
      
      return response.status(200).json({
        message: "User has been updated!",
      });
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error in updating the user.", error });
    }
  }

  static async delete_user(request: Request, response: Response) {
    const { user_id } = request.body;

    try {
      const user = await User.findOneBy({ user_id });

      if (!user) {
        throw new Error("User not found!");
      }

      await User.delete({ user_id });

      return response.status(200).json({
        message: "User has been deleted!"
      });
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Error in deleting the user.", error });
    }
  }

  static async login(request: Request, response: Response) {
    const { user_email, user_password } = request.body;

    try {
      const user = await User.findOneBy({ user_email });
      if (!user) {
        throw new Error("User not found!");
      }

      const isMatch = await verifyPassword(user_password, user.user_password, user.user_salt);

      if (!isMatch) {
        throw new Error("Invalid password!");
      }

      return response.status(200).json({message: "Login successful!", isMatch: isMatch});
    } catch (error) {
      return response.status(400).json({ message: "Error in login", error: error });
    }
  }
}
