import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'viberver#o5%nwwepfiwep';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'vewvwe#2t-432cwecwe';

export function confirmEmailTokenGenerator(payload: object) {
  const activeEmailToken = jwt.sign(payload, JWT_SECRET);

  return { activeEmailToken };
}

export function generateTokensPassword(payload: object) {
  const accessToken7barra7 = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

  const refreshAccessToken7barra7 = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });

  return { accessToken7barra7, refreshAccessToken7barra7 };
}
