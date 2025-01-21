import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography, AppBar, Toolbar, IconButton, Button } from '@mui/material';
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
    const [sections, setSections] = useState([
        { id: 'table', title: 'Crypto Data Table' },
        { id: 'graph', title: 'Crypto Graph Representation' },
        { id: 'cards', title: 'Crypto Card Data' },
    ]);
    const [components, setComponents] = useState([]);
    const [removedSections, setRemovedSections] = useState([]);
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

        const reorderedSections = Array.from(sections);
        const [reorderedSection] = reorderedSections.splice(result.source.index, 1);
        reorderedSections.splice(result.destination.index, 0, reorderedSection);

        setSections(reorderedSections);
    };

    const handleExport = () => {
        const layoutConfig = {
            sections,
            components,
            theme: darkMode ? 'dark' : 'light',
        };
        const jsonConfig = JSON.stringify(layoutConfig, null, 2);
        const blob = new Blob([jsonConfig], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'dashboard-layout.json';
        link.click();
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = (e) => {
            try {
                const importedConfig = JSON.parse(e.target.result);
                if (importedConfig.sections && importedConfig.components && importedConfig.theme) {
                    setSections(importedConfig.sections); 
                    setComponents(importedConfig.components); 
                    setDarkMode(importedConfig.theme === 'dark'); 
                } else {
                    alert('Invalid JSON configuration.');
                }
            } catch (error) {
                alert('Failed to import layout.');
            }
        };
    
        if (file) {
            reader.readAsText(file);
        }
    };

    const handleRemoveSection = (id) => {
        const removedSection = sections.find((section) => section.id === id);
        const updatedSections = sections.filter((section) => section.id !== id);

        setSections(updatedSections);
        setRemovedSections((prev) => [...prev, removedSection]);
    };

    const restoreSection = (id) => {
        const restoredSection = removedSections.find((section) => section.id === id);
        const updatedRemovedSections = removedSections.filter((section) => section.id !== id);

        setRemovedSections(updatedRemovedSections);
        setSections((prev) => [...prev, restoredSection]);
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
                        Crypto DashBoard
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={handleExport}
                        sx={{ marginRight: 2 }}
                    >
                        Export Layout
                    </Button>
                    <Button
                        color="inherit"
                        component="label"
                        sx={{ marginRight: 2 }}
                    >
                        Import Layout
                        <input
                            type="file"
                            accept="application/json"
                            hidden
                            onChange={handleImport}
                        />
                    </Button>
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
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="sections" direction="vertical">
                        {(provided) => (
                            <Box {...provided.droppableProps} ref={provided.innerRef} sx={{ padding: 3, minHeight: 400 }}>
                                {sections.map((section, index) => (
                                    <Draggable key={section.id} draggableId={section.id} index={index}>
                                        {(provided) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                sx={{
                                                    marginBottom: 4,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: 4,
                                                    boxShadow: 3,
                                                    padding: 3,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="h5">{section.title}</Typography>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleRemoveSection(section.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                                {section.id === 'table' && (
                                                    <TableComponent
                                                        tableData={tableGraphData}
                                                        visibleFields={Object.keys(tableGraphData[0] || {})}
                                                    />
                                                )}
                                                {section.id === 'graph' && (
                                                    <LineChartComponent data={tableGraphData} />
                                                )}
                                                {section.id === 'cards' && (
                                                    <Masonry columns={{ md: 2, lg: 3 }} spacing={2}>
                                                        {components.map((comp) => (
                                                            <SummaryCard
                                                                key={comp.Id}
                                                                data={comp}
                                                                onRemove={() => handleRemove(comp.Id)}
                                                            />
                                                        ))}
                                                    </Masonry>
                                                )}
                                            </Box>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>

                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 10,
                        right: 0,
                        width: 300,
                        height: '30vh',
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: '25px',
                        boxShadow: 3,
                        padding: 2,
                        overflowY: 'auto',
                    }}
                >
                    <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 2 }}>
                        Removed Components
                    </Typography>
                    {removedSections.map((section) => (
                        <Box
                            key={section.id}
                            sx={{
                                padding: 2,
                                marginBottom: 2,
                                backgroundColor: theme.palette.background.default,
                                borderRadius: 4,
                                boxShadow: 2,
                            }}
                        >
                            <Typography variant="body1">{section.title}</Typography>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => restoreSection(section.id)}
                                sx={{ marginTop: 1 }}
                            >
                                Add back
                            </Button>
                        </Box>
                    ))}
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Dashboard;
