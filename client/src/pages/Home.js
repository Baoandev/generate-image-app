import { Container, Typography, Button, Stack } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Stack sx={{ textAlign: 'center' }} spacing={3}>
                <Typography gutterBottom variant='h4'>Reimagine Your Spaces with AI-Powered Design</Typography>
                <Typography gutterBottom variant='subtitle1'>Transform ideas into stunning architectural and interior designs in seconds. Powered by cutting-edge Stable Diffusion technology.</Typography>
                <div>
                    <Button component={Link} to='/' variant='contained' sx={{ maxWidth: '200px' }}>Generate Now</Button>
                </div>
            </Stack>
        </Container>
    )
}

export default Home