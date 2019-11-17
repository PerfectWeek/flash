import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as jwt from 'jsonwebtoken';

import * as GoogleProviderService from '../services/GoogleProviderService';

export function googleAuth(req: Request, res: Response) {
  const url = GoogleProviderService.generateAuthUrl();

  console.log(url);
  res.send(url);
}

export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const code: string = req.query.code;

  const token = await GoogleProviderService.getToken(code);

  const userInfo = await GoogleProviderService.getUserInfo(token.tokens.access_token);

  const accessToken = jwt.sign(
    {
      token: token.tokens.access_token,
      name: userInfo.name,
      picture: userInfo.picture
    },
    process.env.JWT_ENCODE_KEY);

  res.status(200).json({
    message: 'Logged in successfully',
    access_token: accessToken,
  });
}
