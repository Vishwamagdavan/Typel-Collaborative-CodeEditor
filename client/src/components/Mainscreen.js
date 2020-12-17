import { React, useState, useEffect } from "react";
import { ThemeProvider, Paper, makeStyles, Grid, Typography, Box, Select,MenuItem,Button } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import ScrollToBottom from 'react-scroll-to-bottom';
import queryString from 'query-string';
import { ControlledEditor } from "@monaco-editor/react";
import { io } from 'socket.io-client';
import theme from './Themes';
import Navbar from "./homescreen/Navbar";
import Home from './Home';
import Message from './Chatbox/Message'
let socket;

const useStyles = makeStyles({
    editor__papper: {
        marginTop: 8
    },


})
function Mainscreen({ location }) {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [code, setCode] = useState('//Write your Code');
    const [codeupdate, setCodeupdate] = useState('')
    const [language,setLanguage]=useState('cpp');
    const[fontsize,setFontsize]=useState(20);
    const [selflanguage,setSelflanguage]=useState('cpp');
    const[selffontsize,setSelffontsize]=useState(20);
    const ENDPOINT = 'localhost:5000';

    const options = {
        fontSize: fontsize
    }
    const selfoptions = {
        fontSize: selffontsize
    }

    function onchangeHandler(ev, event) {
        setCodeupdate(event);
    }
    // Socket for Joining Room

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        socket = io(ENDPOINT);
        setRoom(room);
        setName(name)

        socket.emit('join', { name, room }, (error) => {
            if (error) {
                alert(error)
                return Home;
            }
        });
    }, [ENDPOINT, location.search]);

    // chatMessages
    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });
    }, []);

    // Send to Socket 
    useEffect(() => {
        socket.emit('code-change', codeupdate);
    }, [codeupdate])



    // Recive from the socket
    useEffect(() => {
        socket.on('code-update', (data) => {
            setCode(data);
            console.log('CLIENT ' + data);
        })
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('chatMessage', message, () => setMessage(''));
        }
    }
    console.log(message, messages);
    return (
        <ThemeProvider theme={theme}>
            <Paper style={{ height: "100vh" }} >
                <Navbar />
                <Paper className={classes.editor__papper}>
                        

                    <Grid container justify="flex-start">
                        <Grid item xs={false} sm={5} md={5}>
                            <h1>Live Code</h1>
                        Language:
                        <Select labelId="language" id="select" value={language} style={{padding:10}} onChange={(e)=>{setLanguage(e.target.value);}}>
                            <MenuItem value="javascript">Javascript</MenuItem>
                            <MenuItem value="cpp">C++</MenuItem>
                            <MenuItem value="c">C</MenuItem>
                            <MenuItem value="java">Java</MenuItem>
                            <MenuItem value="python">Python</MenuItem>
                        </Select>
                        FontSize:
                        <Select labelId="fontsize" id="select" value={fontsize} onChange={(e)=>{setFontsize(e.target.value)}}>
                            <MenuItem value="5">5</MenuItem>
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="15">15</MenuItem>
                            <MenuItem value="20">20</MenuItem>
                            <MenuItem value="25">25</MenuItem>
                            <MenuItem value="30">30</MenuItem>
                            <MenuItem value="35">35</MenuItem>
                        </Select>
                            <ControlledEditor
                                width="80vh"
                                height="60vh"
                                language={language}
                                theme="dark"
                                value={code}
                                options={options}
                                onChange={onchangeHandler}
                            />
                        </Grid>
                        <Grid item xs={false} sm={5} md={5}>
                        <h1>Your Code</h1>
                        Language:
                        <Select labelId="language" id="select" value={selflanguage} style={{padding:10}} onChange={(e)=>{setSelflanguage(e.target.value);}}>
                            <MenuItem value="javascript">Javascript</MenuItem>
                            <MenuItem value="cpp">C++</MenuItem>
                            <MenuItem value="c">C</MenuItem>
                            <MenuItem value="java">Java</MenuItem>
                            <MenuItem value="python">Python</MenuItem>
                        </Select>
                        FontSize:
                        <Select labelId="fontsize" id="select" value={selffontsize} onChange={(e)=>{setSelffontsize(e.target.value)}}>
                            <MenuItem value="5">5</MenuItem>
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="15">15</MenuItem>
                            <MenuItem value="20">20</MenuItem>
                            <MenuItem value="25">25</MenuItem>
                            <MenuItem value="30">30</MenuItem>
                            <MenuItem value="35">35</MenuItem>
                        </Select>
                            <ControlledEditor
                                width="80vh"
                                height="60vh"
                                language={selflanguage}
                                theme="dark"
                                options={selfoptions}
                            />
                        <Button type="submit" variant="contained" color="secondary">Compile</Button>
                        </Grid>
                        <Grid item sm={2} md={2}>
                            <Box>
                            <h1>Message Box</h1>
                                <Typography variant="body1">Room:{room}</Typography>
                                <Typography variant="body1">Your Name:{name}</Typography>
                                
                                <form className={classes.form}>
                                    <input
                                        placeholder="type your message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null} />
                                    <input type="submit"  placeholder="send"/>
                                </form>
                                <ScrollToBottom>
                                    {messages.map((m, i) => <div key={i}><Message name={name} message={m} /></div>)}
                                </ScrollToBottom>
                            </Box>
                        </Grid>
                    </Grid>

                </Paper>

            </Paper>

        </ThemeProvider>
    )
};
export default Mainscreen;