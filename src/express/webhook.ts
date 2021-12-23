import express from 'express';
import { EventClass } from '../utils/gitkraken/types';
import { emitEventReducer, gitKrakenEmitter, kofiEmitter } from './processRequest';
import { KofiData } from '../listeners/kofi/DonationListener';
const router = express.Router();

router.post('/hook/gitkraken', (req, res) => {
  const gitkrakenType = req.get('x-gk-event');
  if (!gitkrakenType) return res.status(400).end();
  res.status(200).end();
  const actionType = req.body.action;
  emitEventReducer(<EventClass>gitkrakenType, actionType, req.body);
});

router.post('/hook/kofi', (req, res) => {
  const kofiEmittedData = JSON.parse(req.body.data) as KofiData;

  if (!kofiEmittedData?.message_id) res.status(400).end();
  res.status(200).end();

  kofiEmitter.emit('donation', kofiEmittedData);
});

export default router;
