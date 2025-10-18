import { GmailThreadWithGrading } from "@/services/deep-research/tools";
import { useState } from "react";
import {io} from 'socket.io-client';
import { 
    PlanningResponseSchema, 
    GmailFilterResponseSchema, 
    ErrorResponseSchema, 
    gmailThreadSchemaWithId,
    gmailThreadWithId
} from './model';
import z from "zod";

type IndicatorStatus = {
    status: "notStarted" | "inProgress" | "done"
}

function initIndicatorStatus(size : number){
    let arr: IndicatorStatus[] = []
    arr[0] = { status: "inProgress"}
    for(let i=1 ; i<size ;i++){
        arr[i] = { status: "notStarted"}
    }
    return arr;
}

export function useProjectDeepResearch(){
    const steps = 4;
    const [engineerInfo,setEngineerInfo] = useState("");
    const [additionalCriteria,setAdditionalCriteria] = useState("")
    const [loading,setLoading] = useState(false)
    const [emails,setEmails] = useState<gmailThreadWithId[]>()
    const [indicatorsStatus,setIndicatorsStatus] = useState<IndicatorStatus[]>(initIndicatorStatus(steps))
    const [analysisContent,setAnalysisContent] = useState("")
    const [analysisDialogOpen,setAnalysisDialogOpen] = useState(false)

    function goToNextStep(){
        setIndicatorsStatus(prevStatus => prevStatus.map((item, index) => {
            if(index == 0) return { status: "done" }
            return prevStatus[index-1]
        }))
    }

    async function execDeepResearch(){
        const sendData = {
            engineerInfo,
            additionalCriteria,
        }
        const socket = io(process.env.NEXT_PUBLIC_DEEP_RESEARCH_SOCKET_URL || "http://localhost:8000");
        try {
            // 接続時にこのイベントが発火する
            socket.on('connect', async () => {
                setAnalysisDialogOpen(false)
                setIndicatorsStatus(initIndicatorStatus(steps))
                setLoading(true) 
                console.log('Connected to server');
                socket.emit('requirePlannning', JSON.stringify(sendData));
            });

            socket.on('planningResponse', (data: string) => {
                try {
                    const parsedData = JSON.parse(data);
                    const validated = PlanningResponseSchema.parse(parsedData);
                    console.log('Planning:', validated);
                    goToNextStep();
                    socket.emit('requireGmailFilter', '');
                } catch (e) {
                    console.error('Planning response validation error:', e);
                    setLoading(false);
                }
            });

            socket.on('gmailFilterResponse', (data: string) => {
                try {
                    const parsedData = JSON.parse(data);
                    const validated = GmailFilterResponseSchema.parse(parsedData);
                    console.log('Gmail Filter:', validated);
                    goToNextStep();
                    socket.emit('requireGmailResponse', '');
                } catch (e) {
                    console.error('Gmail filter response validation error:', e);
                    setLoading(false);
                }
            });

            socket.on('mailThreads', (data: string) => {
                try {
                    const parsedData = JSON.parse(data);
                    const validated = (z.array(gmailThreadSchemaWithId)).parse(parsedData);
                    setEmails(validated);
                    goToNextStep();
                    socket.disconnect()
                    setLoading(false);
                } catch (e) {
                    console.error('Mail list validation error:', e);
                    setLoading(false);
                }
            });

            // socket.on('evaluationResponse', (data: string) => {
            //     try {
            //         const parsedData = JSON.parse(data);
            //         const validated = EvaluationResponseSchema.parse(parsedData);
            //         console.log('Evaluation:', validated);
            //         setAnalysisDialogOpen(true);
            //         setLoading(false);
            //         setEmails(validated.threadsWithGradings);
            //     } catch (e) {
            //         console.error('Evaluation response validation error:', e);
            //         setLoading(false);
            //     }
            // });

            socket.on('error', (error: any) => {
                try {
                    const validated = ErrorResponseSchema.parse(error);
                    console.error('Socket error:', validated);
                } catch (e) {
                    console.error('Socket error (unvalidated):', error);
                }
                setLoading(false);
            });
        }
        catch(e){
            console.error(e)
        }
        finally{
            socket.disconnect
            setLoading(false)
        }
    }

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
    }
}