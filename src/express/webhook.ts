import express from 'express';
import { EventClass } from '../utils/gitkraken/types';
import { emitEventReducer, gitKrakenEmitter } from './processRequest';
const router = express.Router();

router.post('/hook/gitkraken', (req, res) => {
  const gitkrakenType = req.get('x-gk-event');
  if (!gitkrakenType) res.status(400).end();
  res.status(200).end();
  const actionType = req.body.action;
  emitEventReducer(<EventClass>gitkrakenType, actionType, req.body);
});

export default router;
