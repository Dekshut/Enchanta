import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  async generateToken(payload) {
    return jwt.sign(payload, 'secret', { expiresIn: '30d' });
  }
}
