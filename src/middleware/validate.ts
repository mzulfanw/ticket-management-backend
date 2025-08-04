import { Request, Response, NextFunction } from 'express';
import { z, ZodType } from 'zod';
import { flattenZodTree } from '../utils/flattenZod.error';

export const validate =
  (schema: ZodType, location: 'body' | 'query' | 'params' = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req[location]);
      if (!result.success) {
        const tree = z.treeifyError(result.error);
        const flatErrors = flattenZodTree(tree);
        return res.status(400).json({
          message: 'Validation failed',
          errors: flatErrors,
        });
      }
      Object.defineProperty(req, location, {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
      next()
    };

