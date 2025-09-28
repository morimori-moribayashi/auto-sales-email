"use server"
import "server-only"
import { addIdToGmailThreads, analyzeResult, deduplicateGmailThreads, evaluateMatching, generateGmailFilter, planningStrategy, searchGmail } from "./tools"
import { GradingOutlined } from "@mui/icons-material"

export async function deepResearch(engineerInfo: string, additionalCriteria: string) {
    return new ReadableStream({
        async start(controller) {
            try {
                function makeResponse(type: string, content: string) {
                    return JSON.stringify({ type, content })
                }

                console.log("deepResearch開始")

                controller.enqueue(makeResponse("plan", ""))
                const strategies = await planningStrategy(engineerInfo, additionalCriteria)
                console.log(strategies)

                controller.enqueue(makeResponse("make_query", ""))
                const filterRes = await Promise.all(strategies.strategies.map(item => {
                    return generateGmailFilter(engineerInfo, additionalCriteria, item)
                }))

                controller.enqueue(makeResponse("search", ""))
                const days = 7
                const pageSize = 50
                const filters = filterRes.map(item => item.filters).flat()
                console.log(filters)
                const GASRes = await Promise.all(filters.map(item => {
                    return searchGmail(item.filter_string, days, pageSize)
                }))
                const emails = deduplicateGmailThreads(GASRes.flat())
                const emailsWithId = addIdToGmailThreads(emails)
                console.log(emailsWithId.flat().map(item => item.subject))

                controller.enqueue(makeResponse("evaluate", ""))
                const gradingRes = await Promise.all(emailsWithId.map(item => evaluateMatching(item, engineerInfo, additionalCriteria)))
                console.log(gradingRes.map(item => { return { grade: item.grade, sub: item.subject } }))

                const stream = await analyzeResult(gradingRes, engineerInfo)
                let content = "";

                for await (const event of stream) {
                    switch (event.type) {
                        case "response.output_text.delta":
                            content += event.delta
                            controller.enqueue(makeResponse("content", content));
                            break;
                        case "response.completed":
                            const output = event.response.output[0];
                            if (output.type == "message" && output.content[0].type == "output_text") {
                                content = output.content[0].text
                            }
                            controller.enqueue(makeResponse("final_content", content));
                            controller.close();
                            break;
                        case "error":
                            controller.error(event.message);
                            break;
                    }
                }
            }
            catch (e) {
                console.log(e)
                controller.error()
            }
            finally{
                console.log("DeepResearch終了")
                controller.close()
            }
        }
    })
}
