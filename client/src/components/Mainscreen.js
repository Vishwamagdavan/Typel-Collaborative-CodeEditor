import { React, useState, useEffect } from "react";
import { ThemeProvider, Paper, makeStyles, Grid, Typography, Box, Select, MenuItem, Button, Tabs, Tab, AppBar } from "@material-ui/core";
import PropTypes from 'prop-types';
import ScrollToBottom from 'react-scroll-to-bottom';
import queryString from 'query-string';
import { ControlledEditor } from "@monaco-editor/react";
import { io } from 'socket.io-client';
import theme from './Themes';
import Navbar from "./homescreen/Navbar";
import Home from './Home';
import Message from './Chatbox/Message'
import './Mainscreen.css';


let socket;
let timeout;
const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    editor__papper: {
        marginTop: 8
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },

})

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Mainscreen({ location }) {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [value, setValue] = useState(0);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [code, setCode] = useState('//Write your Code');
    const [codeupdate, setCodeupdate] = useState('')
    const [language, setLanguage] = useState('cpp');
    const [fontsize, setFontsize] = useState(20);
    const [selflanguage, setSelflanguage] = useState('cpp');
    const [selffontsize, setSelffontsize] = useState(20);
    const [strokecolor, setStrokecolor] = useState('blue');
    const [strokesize, setStrokesize] = useState(5);
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
    const tabhandleChange = (event, newValue) => {
        setValue(newValue);
    };

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

    // Receive message from Socket.io
    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [...messages, message]);
        });
    }, []);

    // Send to code-change to server
    useEffect(() => {
        socket.emit('code-change', codeupdate);
    }, [codeupdate])



    // Recive updated code from the server
    useEffect(() => {
        socket.on('code-update', (data) => {
            setCode(data);
            console.log('CLIENT ' + data);
        })
    }, []);

    useEffect(() => {
        socket.on('canvas-data', (data) => {
            var image = new Image();
            var canvas = document.querySelector('#paint');
            var ctx = canvas.getContext('2d');
            image.onload = () => {
                ctx.drawImage(image, 0, 0);
            }
            image.src = data;
        })
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('chatMessage', message, () => setMessage(''));
        }
    }
    console.log(message, messages);
    const drawOnCanvas = () => {
        console.log('mouse movement')
        var canvas = document.querySelector('#paint');
        var ctx = canvas.getContext('2d');
        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        var mouse = { x: 0, y: 0 };
        var last_mouse = { x: 0, y: 0 };

        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function (e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);


        /* Drawing on Paint App */
        ctx.lineWidth = strokesize;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = strokecolor;

        canvas.addEventListener('mousedown', function (e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', function () {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        var onPaint = function () {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
            if (timeout !== undefined) clearTimeout(timeout);
            timeout = setTimeout(function () {
                var base64ImageData = canvas.toDataURL("image/png", 1.0);
                socket.emit("canvas-data", base64ImageData);
            }, 1000)

        };
    }
    return (
        <ThemeProvider theme={theme}>
            <Paper style={{ height: "100vh" }} >
                <Navbar />
                <Paper className={classes.editor__papper}>
                    <Grid container justify="flex-start">
                        <Grid item xs={false} sm={9} md={9}>
                            <AppBar position="static">
                                <Tabs value={value} onChange={tabhandleChange} aria-label="simple tabs example" variant="fullWidth">
                                    <Tab label="Live Code" {...a11yProps(0)} />
                                    <Tab label="Your Code" {...a11yProps(1)} />
                                    <Tab label="Canvas" {...a11yProps(2)} />
                                </Tabs>
                            </AppBar>

                            <TabPanel value={value} index={0}>
                                Language:
                        <Select labelId="language" id="select" value={language} style={{ padding: 10 }} onChange={(e) => { setLanguage(e.target.value); }}>
                                    <MenuItem value="javascript">Javascript</MenuItem>
                                    <MenuItem value="cpp">C++</MenuItem>
                                    <MenuItem value="c">C</MenuItem>
                                    <MenuItem value="java">Java</MenuItem>
                                    <MenuItem value="python">Python</MenuItem>
                                </Select>
                        FontSize:
                        <Select labelId="fontsize" id="select" value={fontsize} onChange={(e) => { setFontsize(e.target.value) }}>
                                    <MenuItem value="5">5</MenuItem>
                                    <MenuItem value="10">10</MenuItem>
                                    <MenuItem value="15">15</MenuItem>
                                    <MenuItem value="20">20</MenuItem>
                                    <MenuItem value="25">25</MenuItem>
                                    <MenuItem value="30">30</MenuItem>
                                    <MenuItem value="35">35</MenuItem>
                                </Select>
                                <ControlledEditor
                                    width="100vh"
                                    height="70vh"
                                    language={language}
                                    theme="dark"
                                    value={code}
                                    options={options}
                                    onChange={onchangeHandler}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                Language:
                        <Select labelId="language" id="select" value={selflanguage} style={{ padding: 10 }} onChange={(e) => { setSelflanguage(e.target.value); }}>
                                    <MenuItem value="javascript">Javascript</MenuItem>
                                    <MenuItem value="cpp">C++</MenuItem>
                                    <MenuItem value="c">C</MenuItem>
                                    <MenuItem value="java">Java</MenuItem>
                                    <MenuItem value="python">Python</MenuItem>
                                </Select>
                                FontSize:
                        <Select labelId="fontsize" id="select" value={selffontsize} onChange={(e) => { setSelffontsize(e.target.value) }}>
                                    <MenuItem value="5">5</MenuItem>
                                    <MenuItem value="10">10</MenuItem>
                                    <MenuItem value="15">15</MenuItem>
                                    <MenuItem value="20">20</MenuItem>
                                    <MenuItem value="25">25</MenuItem>
                                    <MenuItem value="30">30</MenuItem>
                                    <MenuItem value="35">35</MenuItem>
                                </Select>
                                <ControlledEditor
                                    width="100vh"
                                    height="70vh"
                                    language={selflanguage}
                                    theme="dark"
                                    options={selfoptions}
                                />
                                <Button type="submit" variant="contained" color="secondary">Compile</Button>
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <div className="container">
                                    <div className="container__colorpicker">
                                        <Button onClickCapture={drawOnCanvas}>Start Drawing</Button>
                                    Stroke Size:
                        <Select labelId="strokesize" id="select" value={strokesize} onChange={(e) => { setStrokesize(e.target.value) }}>
                                            <MenuItem value="5">5</MenuItem>
                                            <MenuItem value="10">10</MenuItem>
                                            <MenuItem value="15">15</MenuItem>
                                            <MenuItem value="20">20</MenuItem>
                                            <MenuItem value="25">25</MenuItem>
                                            <MenuItem value="30">30</MenuItem>
                                            <MenuItem value="35">35</MenuItem>
                                        </Select>
                                        Choose Your Color:
                                        <input type="color" onChange={(e) => { setStrokecolor(e.target.value) }} />
                                    </div>
                                    <div className="container__board">
                                        <div className="sketch" id="sketch">
                                            <canvas className="paint" id="paint" ></canvas>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>

                        </Grid>
                        <Grid item sm={3} md={3}>
                            <Box justifyContent="center">
                                <h1>Message Box</h1>
                                <Typography variant="body1">Room:{room}</Typography>
                                <Typography variant="body1">Your Name:{name}</Typography>

                                <ScrollToBottom>
                                    {messages.map((m, i) => <div key={i}><Message name={name} message={m} /></div>)}
                                </ScrollToBottom>
                                <form className={classes.form}>
                                    <input
                                        placeholder="type your message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null} />
                                    <input type="submit" placeholder="send" />
                                </form>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

            </Paper>

        </ThemeProvider>
    )
};
export default Mainscreen;