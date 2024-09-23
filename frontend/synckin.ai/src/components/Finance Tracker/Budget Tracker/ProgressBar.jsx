import React, { useEffect, useState } from "react";
import { LinearProgress, Box, Typography } from "@mui/material";
import { getBudgetProgress } from "./api";

const ProgressBar = ({ budget, onProgressCheck }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      const progressData = await getBudgetProgress(budget._id);
      setProgress(progressData.progress);
      onProgressCheck(budget);
    };
    fetchProgress();
  }, [budget, onProgressCheck]);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" color="textSecondary">
        {progress.toFixed(2)}%
      </Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

export default ProgressBar;
