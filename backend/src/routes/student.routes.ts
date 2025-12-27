import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
    validateAccessToken,
    getStudentDashboardByToken,
    getStudentAssignmentsByToken,
    submitAssignmentByToken,
    getStudentGamesByToken,
    getStudentLibraryByToken,
    requestBookByToken,
    getStudentGradesByToken,
    regenerateAccessToken,
    getStudentAccessLink,
    sendAccessLinkEmail
} from '../controllers/student.controller';

const router = Router();

// ==================== PUBLIC ROUTES (token-based access) ====================

// Validate access token
router.get('/access/:token', validateAccessToken);

// Student portal endpoints (by token)
router.get('/access/:token/dashboard', getStudentDashboardByToken);
router.get('/access/:token/assignments', getStudentAssignmentsByToken);
router.post('/access/:token/assignments/:assignmentId/submit', submitAssignmentByToken);
router.get('/access/:token/games', getStudentGamesByToken);
router.get('/access/:token/library', getStudentLibraryByToken);
router.post('/access/:token/library/request/:bookId', requestBookByToken);
router.get('/access/:token/grades', getStudentGradesByToken);

// ==================== TEACHER ROUTES (authenticated) ====================

// Get/regenerate access link for a student
router.get('/:studentId/access-link', authenticate, getStudentAccessLink);
router.post('/:studentId/regenerate-token', authenticate, regenerateAccessToken);
router.post('/:studentId/send-access-email', authenticate, sendAccessLinkEmail);

export default router;
