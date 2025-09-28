import { Box, CircularProgress, Typography } from '@mui/material'
import { stat } from 'fs'
import { CircleCheckBig, CircleCheckBigIcon } from 'lucide-react'
import React from 'react'

type props = {
    status: "notStarted" | "inProgress" | "done"
    label: string,
}

function ProgressIndicator({status,label}: props) {
    return (
        <Box sx={{ p: 2 }}>
            <Box
                sx={{
                    border: 2,
                    borderStyle: "inherit",
                    borderColor: status === "inProgress"  ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    p: 2,
                    cursor: "default",
                }}
            >{
                    <div>
                        <div className='flex gap-2 items-center'>
                            {status == "inProgress" && <CircularProgress />}
                            {status == "done" && <CircleCheckBig color='green' />}
                            <Typography variant="h6" gutterBottom fontSize={'1rem'} color={status === "inProgress" ? "textPrimary" : "textSecondary"} className='!my-auto'>
                                {label}
                            </Typography>
                        </div>
                        <Typography variant="body2" color="textSecondary">
                            {status == "notStarted" && ""}
                            {status == "inProgress" && "処理中..."}
                            {status == "done" && "完了しました！"}
                        </Typography>
                    </div>
                }
            </Box>
        </Box>)}

    export default ProgressIndicator