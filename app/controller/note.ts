import { Request, Router } from 'express';

import { C7zResponse } from '../class/response';
import * as Authentication from '../model/authentication';
import * as Note from '../model/note';

export const router = Router();

router.get('/api/note', Authentication.isLogged(), async (req: Request, res: C7zResponse, next: any) => {
  try {
    const search = (req.query.search) ? req.query.search + '' : null;
    const limit = +req.query.limit || 20;
    const offset = +req.query.offset || 0;
    const options = {
      search,
      limit,
      offset,
    };

    const data = await Note.getAll(options);
    res.send({data});
  } catch (error) {
    return next(error);
  }
});

router.get('/api/note/:id', Authentication.isLogged(), async (req: Request, res: C7zResponse, next: any) => {
  try {
    const id = req.params.id;
    const options = {
      id,
    };

    const data = await Note.getOne(options);
    res.send({data});
  } catch (error) {
    return next(error);
  }
});

router.put('/api/note/:id', Authentication.isLogged(), async (req: Request, res: C7zResponse, next: any) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const options = {
      ...body,
      _id: id,
    };

    const data = await Note.update(options);
    res.send({data});
  } catch (error) {
    return next(error);
  }
});

router.post('/api/note', Authentication.isLogged(), async (req: Request, res: C7zResponse, next: any) => {
  try {
    const body = req.body;

    const data = await Note.add(body);
    res.send({data});
  } catch (error) {
    return next(error);
  }
});

router.delete('/api/note/:id', Authentication.isLogged(), async (req: Request, res: C7zResponse, next: any) => {
  try {
    const id = req.params.id;
    const options = {
      id,
    };

    await Note.remove(options);
    res.send({status: 200});
  } catch (error) {
    return next(error);
  }
});
