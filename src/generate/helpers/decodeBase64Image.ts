export const decodeBase64Image = (base64Str: string) => {
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const image = {};
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  image['type'] = matches[1];
  image['data'] = Buffer.from(matches[2], 'base64');

  return image;
};
