export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!file) return cb(new Error('file is empty'), false);

  const fileExtention = file.mimetype.split('/').at(1);
  const validExtensions = ['jpg', 'png', 'jpeg', 'gif'];

  if (!validExtensions.includes(fileExtention)) {
    return cb(null, false);
  }

  cb(null, true);
};
