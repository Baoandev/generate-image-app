import React, { useState } from 'react'
import {
    Box,
    Grid2,
    Typography,
    Container,
    Button,
    Paper,
    TextField,
    MenuItem,
    FormLabel
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { generateImageByText } from '../actions/comfy.js';
import GeneratedImage from '../components/GeneratedImage.js';
import { sizes } from '../constants/imageSizes.js';

const Text2Image = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        positive: '',
        negative: '',
        size: sizes[0].value,
        image: {}
    })

    const handleGenerateClick = (e) => {
        e.preventDefault();
        console.log(formData);
        dispatch(generateImageByText(formData));
    }

    return (
        <Container maxWidth='xl' sx={{ py: 4, height: '100%' }}>
            <Grid2 container spacing={8} sx={{ height: '100%' }}>
                <Grid2 size={{ xs: 12, md: 4 }}>
                    <Paper elevation={6} raised>
                        <Grid2 container component='form' noValidate autoComplete="off" direction='column' spacing={4} sx={{ px: 4, py: 4 }}>
                            <Typography variant='h5'>Prompt Text to Image</Typography>
                            <TextField fullWidth multiline name='positive' label='Positive Prompt'
                                value={formData.positive} onChange={(e) => {
                                    setFormData({ ...formData, positive: e.target.value });
                                }} />
                            <TextField fullWidth multiline name='negative' label='Negative Prompt'
                                value={formData.negative} onChange={(e) => {
                                    setFormData({ ...formData, negative: e.target.value });
                                }} />
                            <Grid2 container direction='row'>
                                <TextField
                                    sx={{ flexGrow: 1 }}
                                    select
                                    label="Size Image"
                                    value={formData.size}
                                    helperText="Please select your size"
                                    onChange={(e) => {
                                        setFormData({ ...formData, size: e.target.value });
                                    }}
                                >
                                    {sizes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid2>
                            <Button
                                size='large' type='submit' variant='contained' color='primary'
                                onClick={handleGenerateClick}
                            >
                                Generate Image
                            </Button>
                        </Grid2>
                    </Paper>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 8, height: '100%' }}>
                    <GeneratedImage />
                </Grid2>
            </Grid2>
        </Container>
    )
}

export default Text2Image