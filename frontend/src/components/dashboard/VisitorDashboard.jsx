import React from "react";
import { Box, Button, Stack } from "@mui/material";

import TuneIcon from "@mui/icons-material/Tune";
import SwapVertTwoToneIcon from "@mui/icons-material/SwapVertTwoTone";

function VisitorDashboard() {
  const allListings = [];
  return (
    <div className="map-main">
      {/* LEFT PART (LISTINGS QUERY RESULT) */}
      <Box className="map-left">
        {allListings && (
          <>
            <Stack direction="row" spacing={1} alignItems="center" pt={"10px"}>

              <Button variant="outlined">
                <TuneIcon sx={{ pr: "0.3rem" }} />
                Filters
              </Button>
              <Button variant="outlined">
                <SwapVertTwoToneIcon sx={{ pr: "0.3rem" }} />
                SortBy
              </Button>
            </Stack>


            {/*********** show listings  ***********/}
            <Box sx={{ overflowX: "scroll", height: "84%" }}>
                listings
            </Box>
          </>
        )}
      </Box>

      {/* RIGHT PART (MAP) */}
      <div className="map-right">
        map
      </div>

    </div>
  );
}

export default VisitorDashboard;

