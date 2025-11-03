import { Socket } from 'socket.io';
import { 
    generateGmailFilter, 
    addIdToGmailThreads, 
    deduplicateGmailThreads, 
    evaluateMatching, 
    GmailThread, 
    GmailThreadWithGrading, 
    GmailThreadWithId, 
    planningStrategy, 
    searchGmail 
} from '../deep-research/tools';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { searchGmailFull } from '../gmail/gmail';
import ca from 'zod/v4/locales/ca.js';

interface SocketState {
    engineerInfo: string;
    additionalCriteria: string;
    strategies: string[];
    filters: string[];
    threads: GmailThread[];
    threadsWithId: GmailThreadWithId[];
    threadsWithGradings: GmailThreadWithGrading[];
}

export class SocketHandlers {
    handleConnection(socket: Socket): void {
        const state: SocketState = {
            engineerInfo: "",
            additionalCriteria: "",
            strategies: [],
            filters: [],
            threads: [],
            threadsWithId: [],
            threadsWithGradings: []
        };

        logger.info('Socket connected', { socketId: socket.id });

        socket.on('requirePlannning', (request: string) => 
            this.handlePlanning(socket, request, state)
        );

        socket.on('requireGmailFilter', (request: string) => 
            this.handleGmailFilter(socket, request, state)
        );

        socket.on('requireGmailResponse', (request: string) => 
            this.handleGmailResponse(socket, request, state)
        );

        socket.on('requireEvalutation', (request: string) => 
            this.handleEvaluation(socket, request, state)
        );

        socket.on('disconnect', (reason: string) => 
            this.handleDisconnect(socket, reason)
        );
    }

    private async handlePlanning(socket: Socket, request: string, state: SocketState): Promise<void> {
        logger.info('Planning request received', { request });
        
        try {
            const json = JSON.parse(request);
            state.engineerInfo = json.engineerInfo;
            state.additionalCriteria = json.additionalCriteria;
            
            const res = await planningStrategy(state.engineerInfo, state.additionalCriteria);
            state.strategies = res.strategies;
            
            socket.emit('planningResponse', JSON.stringify(res));
        } catch (error) {
            logger.error('Planning error', { error });
            socket.emit('error', error);
        }
    }

    private async handleGmailFilter(socket: Socket, request: string, state: SocketState): Promise<void> {
        logger.info('Gmail filter request received', { request });
        
        try {
            for await (const strategy of state.strategies.slice(0, config.MAX_STRATEGIES)) {
                const res = await generateGmailFilter(state.engineerInfo, state.additionalCriteria, strategy);
                state.filters.push(...res.filters.map((filter) => filter.filter_string));
            }
            
            socket.emit('gmailFilterResponse', JSON.stringify({ filters: state.filters }));
        } catch (error) {
            logger.error('Gmail filter error', { error });
            socket.emit('error', error);
        }
    }

    private async handleGmailResponse(socket: Socket, request: string, state: SocketState): Promise<void> {
        logger.info('Gmail response request received', { request });
        let date = undefined
        try{
            const json = JSON.parse(request);
            if(json.date){
                date = new Date(json.date);
            }
        }
        catch(error){
            logger.error('Date parsing error', { error });
        }
        try {
            const result = await searchGmailFull(state.filters, date,config.GMAIL_SEARCH_MAX_RESULTS);
            if (!result.success) {
                throw new Error(result.error || 'Gmail search failed');
            }
            state.threads = result.messages.map(msg => ({
                from: msg.from ?? "",
                subject: msg.subject ?? "",
                body: msg.body ?? "",
                date: new Date(msg.date ?? "")
            }));
            state.threads = deduplicateGmailThreads(state.threads);
            state.threadsWithId = addIdToGmailThreads(state.threads);
            
            socket.emit('mailThreads', JSON.stringify({ threads: state.threadsWithId }));
        } catch (error) {
            logger.error('Gmail response error', { error });
            socket.emit('error', error);
        }
    }

    private async handleEvaluation(socket: Socket, request: string, state: SocketState): Promise<void> {
        logger.info('Evaluation request received', { request });
        
        try {
            for await (const thread of state.threadsWithId.slice(0, config.MAX_THREADS_TO_EVALUATE)) {
                const res = await evaluateMatching(thread, state.engineerInfo, state.additionalCriteria);
                state.threadsWithGradings.push(res);
            }
            
            socket.emit('evaluationResponse', JSON.stringify({ threadsWithGradings: state.threadsWithGradings }));
        } catch (error) {
            logger.error('Evaluation error', { error });
            socket.emit('error', error);
        }
    }

    private handleDisconnect(socket: Socket, reason: string): void {
        logger.info('Socket disconnected', { socketId: socket.id, reason });
    }
}
