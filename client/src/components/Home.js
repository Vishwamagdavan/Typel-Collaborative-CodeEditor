import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { GroupAddOutlined, GitHub } from '@material-ui/icons';
import theme from './Themes';
import React, { useState, useEffect } from 'react'
import { Grid, Typography, ThemeProvider, Paper, makeStyles, Button, Box } from "@material-ui/core";
import Background from '../bg.png';
// import BackgroundGIF from '../background.gif';
import { Link } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(${Background})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        color: theme.palette.primary,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    title: {
        padding: 10,
        color: '#000000',
        backgroundColor: '#fff'
    },
    caption: {
        color: '#fff',
        paddingLeft: 10,
        backgroundColor: '#424242'
    }
}));

export default function Home() {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    return (
        <ThemeProvider theme={theme}>
            <Paper style={{ height: "100vh" }} >
                {/* <Navbar /> */}
                <Grid container component="main" className={classes.root}>
                    <CssBaseline />
                    <Grid item xs={false} sm={4} md={9} className={classes.image}>
                        {/* <Typography variant="h2" className={classes.title}>LiveCode.io</Typography>
                        <Typography variant="body2" className={classes.caption}>Create Room - Invite - Code Together</Typography> */}
                    </Grid>
                    <Grid item xs={12} sm={5} md={3} component={Paper} elevation={3} square>
                        <Box mt={5}>
                        </Box>
                        <div className={classes.paper}>
                            <Typography variant="h2">Typl.io</Typography>
                            <Typography variant="body2">Create Room - Invite - Code Together</Typography>
                            <Box m={7} />
                            <Avatar className={classes.avatar} >
                                <GroupAddOutlined />
                            </Avatar>
                            <Typography component="h1" variant="h5"> Create a Room </Typography>
                            <form className={classes.form} noValidate>
                                <TextField variant="outlined" fullWidth margin="normal" id="name" label="#online-name" name="name" onChange={(e) => setName(e.target.value)} />
                                <TextField variant="outlined" fullWidth margin="normal" name="room" label="#room-name" type="text" id="room" onChange={(e) => setRoom(e.target.value)} />
                                <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?name=${name}&room=${room}`} style={{ textDecoration: 'none' }}>
                                    <Button type="submit" fullWidth variant="contained" color="secondary" className={classes.submit} > Join </Button>
                                </Link>

                            </form>
                            {/* <Box m={7}></Box>
                            <GitHub/> */}
                        </div>
                    </Grid>
                </Grid>
            </Paper></ThemeProvider>
    );
}