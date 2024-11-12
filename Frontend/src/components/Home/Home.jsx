import React, { useEffect, useState } from 'react'
import './Home.css'
import axiosInstance from '../../axiosinterceptor';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Fab, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState({
    postContent: '',
    postTags: '',
    postImage: null,
    postAudio: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:3000/posts/posts');

        const postsWithImages = response.data.map((post) => {
          if (post.postImage && post.postImage.data && post.postImage.data.data) {
            const base64String = btoa(                      //binary to base64 conversion
              new Uint8Array(post.postImage.data.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            return {
              ...post,
              postImageUrl: `data:${post.postImage.contentType};base64,${base64String}`
            };
          }
          return post;
        });

        setPosts(postsWithImages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setPostData((prev) => ({ ...prev, postImage: e.target.files[0] }));
  };

  const handleAudioUpload = (e) => {
    setPostData((prev) => ({ ...prev, postAudio: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('postContent', postData.postContent);
    formData.append('postTags', postData.postTags);
    if (postData.postImage) formData.append('postImage', postData.postImage);
    if (postData.postAudio) formData.append('postAudio', postData.postAudio);

    try {
      const response = await axiosInstance.post('http://localhost:3000/posts/addPost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPosts((prev) => [...prev, response.data.post]);
      window.location.reload()
      handleClose();
    } catch (error) {
      console.error("Error adding post:", error);
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
    <>
      <div className="post-feed">
        {loading ? (
          <div className="loading-spinner">
            <CircularProgress color='#2e1d15' />
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <ul className="cards__list">
                <li className="main-card">
                  <div className="card__header">
                    <img className="card__profile-img" src='/defaultprofile.jpg' alt="avatar" />
                    <div className="card__meta">
                      <div className="card__meta__displayname">
                        {post.postAuthor.name}
                      </div>
                      <div className="card__meta__username">
                        @{post.postAuthor.username}
                      </div>
                    </div>
                    <div className="card__menu">
                      <i className="fas fa-ellipsis-h" />
                    </div>
                  </div>
                  <div className="card__body">
                    {post.postContent}
                  </div>
                  <div>
                    {post.postImageUrl && (
                      <img
                        className='post-img'
                        src={post.postImageUrl}
                        alt="Post"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    )}
                  </div>
                  <div className="card__footer">
                    <span className="card__footer__like">
                      {post.postLikes ? post.postLikes.length : 0} likes
                    </span>
                    <span className="card__footer__comment">
                      {post.postComments ? post.postComments.length : 0} comments
                    </span>
                    <span className="card__meta__timestamp">
                      {new Date(post.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          ))
        )}
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
          <DialogTitle>Add New Post</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Content"
              name="postContent"
              multiline
              variant="filled"
              rows={4}
              value={postData.postContent}
              onChange={handleChange}
              sx={{
                width: '260px',
                margin: '25px auto 0',
                display: 'block',
                '& .MuiInputLabel-root': {
                  fontSize: '12px',
                  color: '#2e1d15',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                },
                '& .MuiFilledInput-root': {
                  width: '260px',
                  marginTop: '5px',
                  paddingBottom: '5px',
                  fontSize: '16px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
                  textAlign: 'center',
                }
              }}
            />
            <TextField
              margin="dense"
              label="Tags (comma-separated)"
              name="postTags"
              fullWidth
              variant="standard"
              value={postData.postTags}
              onChange={handleChange}
              sx={textFieldStyles}
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
              Upload Image
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
            <Button
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
              Upload Audio
              <input type="file" hidden onChange={handleAudioUpload} />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button
              className='cancel'
              color='#fbf4da'
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className='submit'
              onClick={handleSubmit}
              color='#fbf4da'
              disabled={!postData.postContent}
            >
              Add Post
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}

export default Home