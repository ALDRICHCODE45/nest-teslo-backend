import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!file) return cb('file is empty', false);

  const fileExtention = file.mimetype.split('/').at(1);

  const newFileName = `${uuid()}.${fileExtention}`;

  cb(null, newFileName);
};
