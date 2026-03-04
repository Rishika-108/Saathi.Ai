import express from 'express'
import { createJournalEntry, getUserJournal, getUserJournalByID, runAnalyser } from '../controllers/journalController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const journalRouter = express.Router();

journalRouter.post('/create', authMiddleware, createJournalEntry);
journalRouter.get('/allJournals', authMiddleware, getUserJournal);
journalRouter.get('/SpecificJournal/:id',authMiddleware, getUserJournalByID);
journalRouter.post("/analyze/:id", authMiddleware, runAnalyser);


export default journalRouter 