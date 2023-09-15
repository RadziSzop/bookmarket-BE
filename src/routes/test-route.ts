import { Request, Response } from "express";
export const test = async (req: Request, res: Response) => {
  return res.json("Hello world!");
};
