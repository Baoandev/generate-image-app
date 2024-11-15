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
import { steps } from '../constants/comfySteps.js';
import UploadImageZone from '../components/UploadImageZone.js'


const ChangeStyle = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        positive: '',
        negative: '',
        steps: steps[0].value,
        size: sizes[0].value,
        image1: '',
        image2: ''
    })

    const handleGenerateClick = (e) => {
        e.preventDefault();
        console.log(formData);
        dispatch(generateImageByText(formData));
    }
    return (
        <Container maxWidth='xl' sx={{ py: 4, height: '100%' }}>
            <Grid2 container spacing={8} sx={{ height: '100%' }}>
                <Grid2 container spacing={2} direction='column' sx={{}} size={{ xs: 12, md: 4 }}>
                    <Paper elevation={6} raised>
                        <Grid2 container component='form' noValidate autoComplete="off" direction='column' spacing={4} sx={{ px: 4, py: 4 }}>
                            <Typography variant='h5'>Prompt Change Styles Image</Typography>
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
                                    label="Step"
                                    helperText="Please select step"
                                    value={formData.steps}
                                    onChange={(e) => {
                                        setFormData({ ...formData, steps: e.target.value });
                                    }}
                                >
                                    {steps.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid2>
                            <Grid2 container direction='row' sx={{ flexWrap: 'nowrap' }}>
                                <Grid2 container direction='column' spacing={0.5}>
                                    <Typography variant='body2' color='textSecondary'>Your Image</Typography>
                                    <UploadImageZone fileBase64={formData.image1} onChange={(e) => {
                                        setFormData({ ...formData, image1: e });
                                    }} />
                                </Grid2>
                                <Grid2 container direction='column' spacing={0.5}>
                                    <Typography variant='body2' color='textSecondary'>Image Style</Typography>
                                    <UploadImageZone fileBase64={formData.image2} onChange={(e) => {
                                        setFormData({ ...formData, image2: e });
                                    }} />
                                </Grid2>
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

export default ChangeStyle