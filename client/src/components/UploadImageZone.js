import React, { useCallback, useEffect, useState } from 'react';
import { TextField, IconButton, Box, Typography, Paper, Grid2 } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDropzone } from 'react-dropzone';

function UploadImageZone({ fileBase64, onChange, ...props }) {
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (fileBase64) {
            setImage({
                name: '',
                preview: fileBase64,
            });
        } else {
            setImage(null);
        }
        return () => {
            if (image?.preview) {
                URL.revokeObjectURL(image.preview);
            }
        };
    }, [fileBase64]);

    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles[0]) {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result;
                    setImage({ name: acceptedFiles[0].path, preview: result });
                    if (typeof onChange === 'function')
                        onChange({ name: acceptedFiles[0].path, image: result } || {});
                };
                reader.readAsDataURL(acceptedFiles[0]);
            }
        },
        [onChange]
    );

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        maxFiles: 1,
        onDrop,
    });

    const handleDeleteImage = () => {
        setImage(null);
        if (typeof onChange === 'function')
            onChange({});
    };

    return (
        <Paper variant='outlined' sx={{
            maxHeight: '324px',
            display: 'flex',
            justifyContent: 'center'
        }} {...props}>
            {!image?.preview ? (
                <Grid2 container
                    {...getRootProps()}
                    sx={{ p: 2, cursor: 'pointer', width: '100%', height: '100%' }}
                >
                    <input {...getInputProps()} />
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        Drag and drop a file here, or click to select a file
                    </Typography>
                </Grid2>
            ) : (
                <Box
                    sx={{
                        position: 'relative',
                        minHeight: '100px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: '1px',
                    }}
                >
                    <IconButton
                        onClick={handleDeleteImage}
                        sx={{
                            position: 'absolute',
                            fontSize: '16px',
                            p: '4px',
                            right: '8px',
                            top: '8px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': { boxShadow: '0 0 4px #d3d3d3', background: '#dddddd', color: 'black' },
                        }}
                        aria-label="delete"
                    >
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                    <img
                        src={image.preview}
                        style={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'contain',
                        }}
                        alt={image.name}
                    />
                </Box>
            )}
        </Paper>
    );
}

export default UploadImageZone;
