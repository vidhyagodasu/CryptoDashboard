import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Masonry from '@mui/lab/Masonry';
import TableComponent from './CryptoTable';
import LineChartComponent from './GraphComponent';
import SummaryCard from './CryptoCard';
import { useSelector } from 'react-redux';
import { Container } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';
import { MoonIcon, SunIcon } from '../Assets/Images/Icons';

const Dashboard = () => {
    const cryptoApiData = useSelector((state) => state.crypto.data);
    const status = useSelector((state) => state.crypto.status);
    const error = useSelector((state) => state.crypto.error);

    const [tableGraphData, setTableGraphData] = useState([]);
    const [components, setComponents] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [isPreloading, setIsPreloading] = useState(true);

    useEffect(() => {
        const savedComponents = localStorage.getItem('crypto-dashboard-layout');
        if (savedComponents) {
            setComponents(JSON.parse(savedComponents));
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsPreloading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const filteredApiData = cryptoApiData.map((item, index) => ({
            Id: index + 1,
            Name: item.name,
            Symbol: item.symbol,
            Image: item.image,
            'Current Price': item.current_price,
            'Market Capital': item.market_cap,
            'Market Capital Rank': item.market_cap_rank,
            'Total Volume': item.total_volume,
            High: item.high_24h,
            Low: item.low_24h,
            'Price Change': item.price_change_24h,
            'Price Change Percentage': item.price_change_percentage_24h,
            'Total Supply': item.total_supply,
            'Max Supply': item.max_supply,
            Ath: item.ath,
            'Ath Change Percentage': item.ath_change_percentage,
            Atl: item.atl,
            'Atl Change Percentage': item.atl_change_percentage,
        }));
        setTableGraphData(filteredApiData);

        if (!localStorage.getItem('crypto-dashboard-layout')) {
            setComponents(filteredApiData);
        }
    }, [cryptoApiData]);

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(components);
        const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, reorderedItem);

        setComponents(reorderedItems);

        localStorage.setItem('crypto-dashboard-layout', JSON.stringify(reorderedItems));
    };

    const handleRemove = (id) => {
        const updatedComponents = components.filter((comp) => comp.Id !== id).map((comp, index) => ({
            ...comp,
            Id: index + 1,
        }));
        setComponents(updatedComponents);

        localStorage.setItem('crypto-dashboard-layout', JSON.stringify(updatedComponents));
    };

    if (isPreloading) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h3"><CircularProgress /> Loading Dashboard...</Typography>
            </Box>
        );
    }

    if (status === 'loading') {
        return (
            <Typography
                variant="h4"
                sx={{ my: 4, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                Loading...
            </Typography>
        );
    }

    if (status === 'failed') {
        return (
            <Typography variant="h4" color="error">
                Failed to load data: {error}
            </Typography>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        DASHBOARD
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={() => setDarkMode(!darkMode)}
                        aria-label="toggle theme"
                    >
                        {darkMode ? <SunIcon /> : <MoonIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl">
                <Box sx={{ padding: '16px' }}>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h4" sx={{ my: 4, textAlign: 'center' }}>
                            Crypto Data Table
                        </Typography>
                        <TableComponent tableData={tableGraphData} visibleFields={Object.keys(tableGraphData[0] || {})} />
                    </Box>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h4" sx={{ my: 4, textAlign: 'center',mt:6 }}>
                            Crypto Graph Representation
                        </Typography>
                        <LineChartComponent data={tableGraphData} />
                    </Box>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Typography variant="h4" sx={{ my: 4, textAlign: 'center',mt:9 }}>
                            Crypto Card Data
                        </Typography>
                        <Droppable droppableId="dashboard" direction="vertical">
                            {(provided) => (
                                <Box
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    sx={{
                                        padding: 3,
                                        background: theme.palette.background.default,
                                        minHeight: 400,
                                    }}
                                >
                                    <Masonry columns={{ md: 2, lg: 3 }} spacing={2}>
                                        {components.map((comp, index) => (
                                            <Draggable key={comp.Id} draggableId={String(comp.Id)} index={index}>
                                                {(provided) => (
                                                    <Box
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        sx={{
                                                            userSelect: 'none',
                                                            backgroundColor: theme.palette.background.paper,
                                                            borderRadius: 4,
                                                            boxShadow: `0 1px 3px ${darkMode ? '#fff' : 'rgba(0,0,0,0.2)'}`,
                                                            ...provided.draggableProps.style,
                                                        }}
                                                    >
                                                        <SummaryCard
                                                            data={comp}
                                                            onRemove={() => handleRemove(comp.Id)}
                                                        />
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Masonry>
                                </Box>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Dashboard;
