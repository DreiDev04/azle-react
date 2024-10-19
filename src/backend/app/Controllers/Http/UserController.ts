import { generatePasswordHash, verifyPassword } from "App/utils/helpers";
import { User } from "Database/entities/user";
import { Response, Request, response } from "express";
import session from "express-session";

declare module 'express-session' {
  interface Session {
    user: User,
    visited: boolean
  }
}

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

      // console.log(user_password);
      // console.log(password.hash);
      // console.log(password.salt);


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
      // console.log(user_password);
      // console.log(user.user_password);
      // console.log(user.user_salt);

      const isMatch = verifyPassword(user_password, user.user_password, user.user_salt);

      if (!isMatch) {
        return response.status(400).json({
          status: 400,
          message: "Invalid password!",
        });
      }
      // response.cookie('connect.sid', request.sessionID, { httpOnly: true, secure: false });
      // request.session.user = user;
      // request.session.visited = true;
      // console.log(`Session: ${request.session}`);
      // console.log(`Session ID: ${request.sessionID}`);
      // console.log(`Session Store: ${request.sessionStore}`);

      request.session.save(err => {
          if (err) {
              return response.status(500).json({ message: 'Failed to save session' });
          }
          response.json({ message: 'Profile updated successfully' });
      });

      return response.status(200).send({
        status: 200,
        message: "Login successful!",
        user: user
      });
      
    } catch (error) {
      return response.status(400).send({ message: "Error in login", error: error });
    }
  }

  static async status(req: Request, res: Response) {
    // console.log(`Session: ${req.session}`);
    // console.log(`Session ID: ${req.sessionID}`);
    return response.status(200).send({session: req.session, sessionID: req.sessionID});
  }

  static async logout(req: Request, res: Response) {
    // Destroy the session
    console.log(req.session);

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
  
      // Successfully logged out
      res.json({ status: 200, message: 'Logged out successfully' });
    });
  };

  static async profile(req: Request, res: Response){
    // Check if user is authenticated
    console.log(req.session);
    
    if (!(req.session.user)) {
      return res.status(200).json({ message: 'Not authenticated', isAuthenticated: false });
    }
  
    // Send user data back to the client
    res.status(200).json({ user: req.session.user, isAuthenticated: true });
  };
}
