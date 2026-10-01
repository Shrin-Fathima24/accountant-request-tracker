import { Router } from 'express';
import { createRequest, listOverdueRequests, listRequests, updateRequestStatus } from '../controllers/requestController.js';

const router = Router();
router.get('/overdue', listOverdueRequests);
router.get('/', listRequests);
router.post('/', createRequest);
router.patch('/:id/status', updateRequestStatus);
export default router;
