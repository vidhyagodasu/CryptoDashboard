import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { Grid } from '@mui/system';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const SummaryCard = ({ data, onRemove }) => {
    const highestPrice = data.High;
    const lowestPrice = data.Low;
    const avgMarketCap = (highestPrice + lowestPrice) / 2;

    return (
        <Card sx={{ 
            minWidth: 250, 
            boxShadow: 6, 
            borderRadius: 3, 
            transition: "all 0.3s ease", 
            '&:hover': { boxShadow: 12 }
        }}>
            <CardContent sx={{ position: "relative", padding: 3 }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={8}>
                        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, fontSize: 18 }}>
                            {data.Name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Highest Price: ${highestPrice.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Lowest Price: ${lowestPrice.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Avg Market Cap: ${avgMarketCap.toFixed(2)}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <img src={data.Image} width="60" alt={`${data.Name}`} style={{ borderRadius: '50%' }} />
                    </Grid>
                </Grid>
                {onRemove && (
                    <IconButton
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "error.main",
                            backgroundColor: "white",
                            border: "1px solid #ddd",
                            borderRadius: "50%",
                            boxShadow: 1,
                            transition: "transform 0.3s ease, background-color 0.3s ease",
                            '&:hover': {
                                transform: "scale(1.2)",
                                backgroundColor: "#ffcccc",
                            },
                            width: 28, 
                            height: 28, 
                        }}
                        onClick={onRemove}
                    >
                        <CloseRoundedIcon fontSize="small" />
                    </IconButton>
                )}
            </CardContent>
        </Card>
    );
};
export default SummaryCard;
