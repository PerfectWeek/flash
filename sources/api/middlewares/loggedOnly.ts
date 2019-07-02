import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

//
// Check if the requesting user is authenticated
//
export async function loggedOnly(req: Request, res: Response, next: Function) {

    // Check token presence
  let token = <string>req.headers['authorization'];
  if (!token) {
    return res.status(401).send('You need to be authenticated to perform this action');
  }

    // Check token format
  if (token.slice(0, 7) !== 'Bearer ') {
    return res.status(401).send('Invalid authentication token');
  }

  token = token.slice(7);

    // Verify token
  let decoded;
  try {
    decoded = <any>jwt.verify(token, process.env.JWT_ENCODE_KEY);
  } catch (error) {
    return res.status(401).send('Invalid authentication token');
  }

    // Add the user to the Request and continue the pipeline
  (<any>req).user_info = decoded;
  next();
}
