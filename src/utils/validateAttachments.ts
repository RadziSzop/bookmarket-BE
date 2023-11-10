import { MulterError } from "multer";
import { upload } from "./multer";
import { Request, Response } from "express";
import { imageSize } from "image-size";

export const validateAttachments = (errorCode: number, fieldName: string) => {
  return (req: Request, res: Response, next: () => void) => {
    try {
      const attachmentsUpload = upload.single(fieldName);
      attachmentsUpload(req, res, async (err: unknown) => {
        const image = req.file;
        console.log("image", image);

        if (!image && !(err instanceof MulterError)) {
          res.status(400).json({
            success: false,
            errors: [
              {
                message: "No image provided",
                errorCode: errorCode + 1,
              },
            ],
          });
          return;
        } else {
          if (err instanceof MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
              return res.status(400).json({
                success: false,
                errors: [
                  {
                    message: "Image size too large",
                    errorCode: errorCode + 2,
                    field: err.field,
                  },
                ],
              });
            }
            if (err.code === "LIMIT_FILE_COUNT") {
              return res.status(400).json({
                success: false,
                errors: [
                  {
                    message: "Too many files",
                    errorCode: errorCode + 3,
                    field: err.field,
                  },
                ],
              });
            }
            if (err.code === "LIMIT_FIELD_COUNT") {
              return res.status(400).json({
                success: false,
                errors: [
                  {
                    message: "Too many fields",
                    errorCode: errorCode + 4,
                    field: err.field,
                  },
                ],
              });
            }
          } else {
            const maxWidth = 6400;
            const maxHeight = 6400;
            const { height, width, type } = imageSize(image.path);
            console.log({ height, width, type });

            if (width > maxWidth) {
              return res.status(400).json({
                success: false,
                errors: [
                  {
                    message: "Image width too large",
                    errorCode: errorCode + 5,
                    field: fieldName,
                  },
                ],
              });
            }
            if (height > maxHeight) {
              return res.status(400).json({
                success: false,
                errors: [
                  {
                    message: "Image height too large",
                    errorCode: errorCode + 6,
                    field: fieldName,
                  },
                ],
              });
            }
            if (
              (type !== "jpg" && type !== "png") ||
              (!image.originalname.endsWith(".jpg") &&
                !image.originalname.endsWith(".png") &&
                !image.originalname.endsWith(".jpeg"))
            ) {
              return res.status(400).json({
                success: false,
                errors: [
                  {
                    message: "Invalid image format",
                    errorCode: errorCode + 7,
                    field: fieldName,
                  },
                ],
              });
            }
          }
          next();
        }
      });
    } catch (err) {
      console.log("aaa", err);
      res.status(503).json({
        success: false,
        errors: [
          {
            message: "Server error",
            errorCode: errorCode + 99,
          },
        ],
      });
    }
  };
};
