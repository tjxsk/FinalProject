import React, { useEffect, useState } from 'react'
import './Books.css'
import axiosInstance from '../../axiosinterceptor';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';



const Books = () => {

    const [books, setBooks] = useState([]);
    const [open, setOpen] = useState(false);
    const [bookData, setBookData] = useState({
        bookName: '',
        bookAuthor: '',
        bookImage: null,
        isAvailable: true,
        location: '',
    });

    // const [userLocation, setUserLocation] = useState('');

    useEffect(() => {
        axiosInstance.get('http://localhost:3000/books').then((res) => {
            setBooks(res.data);
        })

        // const fetchBooks = async (latitude, longitude) => {
        //     try {
        //         const response = await axios.get('http://localhost:3000/books/nearby', {
        //             params: { latitude, longitude }
        //         });
        //         setBooks(response.data);
        //         setLoading(false);
        //     } catch (error) {
        //         console.error("Error fetching books:", error);
        //         setLoading(false);
        //     }
        // };

        // Get user's current location
        // navigator.geolocation.getCurrentPosition(
        //     async (position) => {
        //         const { latitude, longitude } = position.coords;
        //         fetchBooks(latitude, longitude);
        //     },
        //     (error) => {
        //         console.error("Error getting location:", error);
        //         setLoading(false);
        //     }
        // );
        // navigator.geolocation.getCurrentPosition(
        //     async (position) => {
        //         const { latitude, longitude } = position.coords;
        //         try {
        //             const response = await axiosInstance.get('http://localhost:3000/books/getLocation', {
        //                 params: { latitude, longitude }
        //             });
        //             const locationName = response.data.location || 'Unknown Location';
        //             setUserLocation(locationName);  


        //             fetchBooks(latitude, longitude);
        //         } catch (error) {
        //             console.error('Error fetching location:', error);
        //             setLoading(false);
        //         }
        //     },
        //     (error) => {
        //         console.error("Error getting location:", error);
        //         setLoading(false);
        //     }
        // );
    }, []);


    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setBookData({
            bookName: '',
            bookAuthor: '',
            isAvailable: true,
            location: '',
            bookImage: null,
        });
        setOpen(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        setBookData((prev) => ({ ...prev, bookImage: e.target.files[0] }));
    };



    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('bookName', bookData.bookName);
        formData.append('bookAuthor', bookData.bookAuthor);
        formData.append('isAvailable', bookData.isAvailable);
        formData.append('location', bookData.location);
        formData.append('bookImage', bookData.bookImage);

        try {
            const response = await axiosInstance.post('http://localhost:3000/books/addBook', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Book added successfully:", response.data);
            handleClose();
            window.location.reload()
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };


    const textFieldStyles = {
        width: '260px',
        margin: '25px auto 0',
        display: 'block',
        '& .MuiInputLabel-root': {
            fontSize: '12px',
            color: '#2e1d15',
            textTransform: 'uppercase',
            textAlign: 'center',
        },
        '& .MuiInput-root': {
            width: '100%',
            marginTop: '5px',
            paddingBottom: '5px',
            fontSize: '16px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
            textAlign: 'center',
        },
    };

    return (

        <div className='book-list'>
            <div className="main">
                <h1>Browse Books</h1>
                <ul className="cards">
                    {books.map((book) => (
                        <li className="cards_item">
                            <div className="card">
                                <div className="card_image"><img src={`data:${book.bookImage.contentType};base64,${btoa(
                                    String.fromCharCode(...new Uint8Array(book.bookImage.data.data))
                                )}`} />
                                </div>
                                <div className="card_content">
                                    <Typography gutterBottom variant="" component="div" sx={{ fontSize: '1', fontWeight: '700' }}>{book.bookName}</Typography>
                                    <Typography variant="" component="div" sx={{ fontSize: 15 }}>Author: {book.bookAuthor}</Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Availability : {book.isAvailable ? 'Available' : 'Unavailable'}</Typography>
                                    <Typography variant="" component="div" sx={{ fontSize: 13, color: 'text.secondary' }}>Location: {book.location.name}</Typography>
                                    <Typography component="div" sx={{ fontSize: 13, color: 'text.secondary' }}>Distance: {(book.distance / 1000).toFixed(2)} km away</Typography>
                                    <Button className='btn-contact'>
                                        contact
                                    </Button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <Fab
                    className='btn-add'
                    aria-label="add"
                    onClick={handleOpen}
                    sx={{
                        color: '#fbf4da',
                        backgroundColor: '#2e1d15',
                        position: 'fixed',
                        bottom: 30,
                        right: 40,
                        height: 70,
                        width: 70
                    }}
                >
                    <AddIcon />
                </Fab>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    sx={{
                        '& .MuiDialogTitle-root': {
                            backgroundColor: '#d7ceb0',
                            color: '#2e1d15',
                        },
                        '& .MuiDialogContent-root': {
                            backgroundColor: '#d7ceb0',
                            color: '#2e1d15',
                            padding: '20px',
                        },
                        '& .MuiDialogActions-root': {
                            backgroundColor: '#d7ceb0',
                            color: '#2e1d15',
                            justifyContent: 'space-between',
                        }
                    }}
                >
                    <DialogTitle>Add New Book</DialogTitle>
                    <DialogContent>
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Book Name"
                                name="bookName"
                                fullWidth
                                variant="standard"
                                value={bookData.bookName}
                                onChange={handleChange}
                                sx={textFieldStyles}
                            />
                            <TextField
                                margin="dense"
                                label="Author"
                                name="bookAuthor"
                                fullWidth
                                variant="standard"
                                value={bookData.bookAuthor}
                                onChange={handleChange}
                                sx={textFieldStyles}
                            />
                            <TextField
                                margin="dense"
                                label="Location"
                                name="location"
                                fullWidth
                                variant="standard"
                                value={bookData.location}
                                onChange={handleChange}
                                sx={textFieldStyles}
                                disabled
                            />
                            <Button
                                className='btn-uploadimg'
                                variant="contained"
                                component="label"
                                sx={{
                                    width: '260px',
                                    margin: '25px auto 0',
                                    display: 'block',
                                    mt: 2,
                                    backgroundColor: '#2e1d15',
                                    color: '#fbf4da',
                                    textAlign: 'center'
                                }}
                            >
                                Upload Book Image
                                <input
                                    type="file"
                                    name='bookImage'
                                    hidden
                                    onChange={handleImageUpload}
                                />
                            </Button>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button className='cancel' color='#fbf4da' onClick={handleClose}>Cancel</Button>
                        <Button
                            className='submit'
                            onClick={handleSubmit}
                            color='#fbf4da'
                            disabled={!bookData.bookName || !bookData.bookAuthor || !bookData.bookImage}
                        >
                            Add Book
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>


        </div >
    )
}

export default Books