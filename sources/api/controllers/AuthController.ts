import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { generateAuthUrl, getToken, fetchEventsTimeSlots } from '../services/GoogleProviderService';

export function googleAuth(req: Request, res: Response) {
  const url = generateAuthUrl();

  console.log(url);
  res.redirect(url);
}

export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const code: string = req.query.code;

  const token = await getToken(code);

  console.log(token);
  res.status(201).send('LOL');
}

export async function falseLogin(token: string) {
  console.log(await fetchEventsTimeSlots(token));
}
