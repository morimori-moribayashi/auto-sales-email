import { useState, useCallback } from "react";
import { io, Socket } from 'socket.io-client';
import { 
    PlanningResponseSchema, 
    GmailFilterResponseSchema, 
    ErrorResponseSchema, 
    gmailThreadSchemaWithId,
    gmailThreadWithId
} from './model';
import z from "zod";

type IndicatorStatus = {
    status: "notStarted" | "inProgress" | "done";
}

type DeepResearchData = {
    engineerInfo: string;
    additionalCriteria: string;
}

type SocketEventHandlers = {
    onConnect: () => void;
    onPlanningResponse: (data: string) => void;
    onGmailFilterResponse: (data: string) => void;
    onMailThreads: (data: string) => void;
    onError: (error: any) => void;
}

const STEPS = 4;

function initIndicatorStatus(size: number): IndicatorStatus[] {
    const arr: IndicatorStatus[] = Array(size).fill({ status: "notStarted" });
    arr[0] = { status: "inProgress" };
    return arr;
}

function createSocketEventHandlers(
    goToNextStep: () => void,
    setEmails: (emails: gmailThreadWithId[]) => void,
    setLoading: (loading: boolean) => void,
    socket: Socket
): SocketEventHandlers {
    const handleParseError = (error: unknown, context: string) => {
        console.error(`${context} validation error:`, error);
        setLoading(false);
    };

    return {
        onConnect: () => {
            console.log('Connected to server');
        },
        
        onPlanningResponse: (data: string) => {
            try {
                const parsedData = JSON.parse(data);
                const validated = PlanningResponseSchema.parse(parsedData);
                console.log('Planning:', validated);
                goToNextStep();
                socket.emit('requireGmailFilter', '');
            } catch (error) {
                handleParseError(error, 'Planning response');
            }
        },

        onGmailFilterResponse: (data: string) => {
            try {
                const parsedData = JSON.parse(data);
                const validated = GmailFilterResponseSchema.parse(parsedData);
                console.log('Gmail Filter:', validated);
                goToNextStep();
                socket.emit('requireGmailResponse', '');
            } catch (error) {
                handleParseError(error, 'Gmail filter response');
            }
        },

        onMailThreads: (data: string) => {
            try {
                const parsedData = JSON.parse(data);
                const validated = z.array(gmailThreadSchemaWithId).parse(parsedData);
                setEmails(validated);
                goToNextStep();
                socket.disconnect();
                setLoading(false);
            } catch (error) {
                handleParseError(error, 'Mail list');
            }
        },

        onError: (error: any) => {
            try {
                const validated = ErrorResponseSchema.parse(error);
                console.error('Socket error:', validated);
            } catch {
                console.error('Socket error (unvalidated):', error);
            }
            setLoading(false);
        }
    };
}

function setupSocketListeners(socket: Socket, handlers: SocketEventHandlers, data: DeepResearchData) {
    socket.on('connect', () => {
        handlers.onConnect();
        socket.emit('requirePlannning', JSON.stringify(data));
    });

    socket.on('planningResponse', handlers.onPlanningResponse);
    socket.on('gmailFilterResponse', handlers.onGmailFilterResponse);
    socket.on('mailThreads', handlers.onMailThreads);
    socket.on('error', handlers.onError);
}

export function useProjectDeepResearch() {
    const [engineerInfo, setEngineerInfo] = useState("");
    const [additionalCriteria, setAdditionalCriteria] = useState("");
    const [loading, setLoading] = useState(false);
    const [emails, setEmails] = useState<gmailThreadWithId[]>();
    const [indicatorsStatus, setIndicatorsStatus] = useState<IndicatorStatus[]>(initIndicatorStatus(STEPS));
    const [analysisContent, setAnalysisContent] = useState("");
    const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);

    const goToNextStep = useCallback(() => {
        setIndicatorsStatus(prevStatus => prevStatus.map((item, index) => {
            if (index === 0) return { status: "done" };
            return prevStatus[index - 1];
        }));
    }, []);

    const resetState = useCallback(() => {
        setAnalysisDialogOpen(false);
        setIndicatorsStatus(initIndicatorStatus(STEPS));
        setLoading(true);
    }, []);

    const execDeepResearch = useCallback(async () => {
        const sendData: DeepResearchData = {
            engineerInfo,
            additionalCriteria,
        };

        const socketUrl = process.env.NEXT_PUBLIC_DEEP_RESEARCH_SOCKET_URL || "http://localhost:8000";
        const socket = io(socketUrl);
        
        resetState();

        try {
            const handlers = createSocketEventHandlers(goToNextStep, setEmails, setLoading, socket);
            setupSocketListeners(socket, handlers, sendData);
        } catch (error) {
            console.error('Socket setup error:', error);
            setLoading(false);
            socket.disconnect();
        }
    }, [engineerInfo, additionalCriteria, resetState]);

    return {
        engineerInfo,
        setEngineerInfo,
        additionalCriteria,
        setAdditionalCriteria,
        loading,
        setLoading,
        emails,
        setEmails,
        indicatorsStatus,
        setIndicatorsStatus,
        analysisContent,
        setAnalysisContent,
        analysisDialogOpen,
        setAnalysisDialogOpen,
        execDeepResearch,
    };
}
