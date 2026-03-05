import express from 'express'
import { createJournalEntry, fetchPeerMatches, getUserJournal, getUserJournalByID,} from '../controllers/journalController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserAnalysis } from '../controllers/dashboardController.js';

const journalRouter = express.Router();

journalRouter.post('/create', authMiddleware, createJournalEntry);
journalRouter.get('/allJournals', authMiddleware, getUserJournal);
journalRouter.get('/SpecificJournal/:id',authMiddleware, getUserJournalByID);
journalRouter.get("/matching", authMiddleware, fetchPeerMatches);
journalRouter.get("/analysis-list", authMiddleware, getUserAnalysis)


export default journalRouter 