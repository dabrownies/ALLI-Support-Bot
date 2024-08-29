'use client'
import { bottomNavigationActionClasses, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello I'm Alli! I'm your personal coding & support bot! What's on your mind today?"
    }
  ]);

  const [message, setMessage] = useState('');
 
  const sendMessage = async() => {
    setMessage('');
    setMessages((messages) => [
      ...messages,
      {role: 'user', content: message},
      {role: 'assistant', content: ''}
    ]);
    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(function processText({done, value}) {
        if(done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), {stream: true});
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      p={2}
      sx={{
        position: 'relative', 
        pt: '9%',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '7%',
          left: '47.8%',
          width: '90px', // Increased size
          height: '90px', // Increased size
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid magenta', // Thicker border
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#202123',
          boxShadow: '0 0 10px 5px purple', // Enhanced shadow
          zIndex: 10,
        }}
      >
        <Image
          src="/images/other.jpg"
          alt="Headstarter Support Agent Logo" 
          width={110}
          height={100}
        />
      </Box>

      <Typography
        variant="h3"
        component="h1"
        color="white"
        fontWeight="bold"

        sx= {{ 
          mb: 2, 
          fontFamily: 'Arial',
        }}
      >
        Say Hello to Alli.
      </Typography>

      <Typography
        variant="h6"
        color="white"
        sx= {{
          mb: 2,
          fontFamily: 'Roboto Serif, sans-serif',
          fontStyle: 'italic'
        }}
      >
        Your own personal support bot for when coding gets tough, and the stress gets tougher.
      </Typography>

      <Stack
        direction="column"
        width="1200px"
        height="600px"
        border="1px solid dark gray"
        p={2}
        spacing={3}
        bgcolor="#202123" // Chatbox background
        sx={{
          boxShadow: '0 0 25px 3px purple',
          borderRadius: '16px',
          zIndex: 1,
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          sx= {{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#202123', // Scrollbar track color
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#202123', // Scrollbar thumb color
              borderRadius: '50px',
              transition: 'background-color 0.5s ease 0.7s',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'magenta', // Scrollbar thumb color on hover
            },
          }}
        >
          {
            messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant' ? 'gray' : 'purple'
                  }
                  color="white"
                  borderRadius={16}
                  p={3}
                >
                  {message.content}
                </Box>
              </Box>
            ))
          }
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField 
            label="Ask Alli anything!"
            fullWidth 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            InputProps={{
              style: {
                color: 'white',
                backgroundColor: '#4d5156',
              }
            }}
            InputLabelProps={{
              style: {
                color: 'white'
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: "25px",
                '& fieldset': {
                  borderColor: 'magenta',
                  boxShadow: '0 0 5px 2px magenta',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                  boxShadow: '0 0 5px 2px white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'aquamarine',
                  boxShadow: '0 0 5px 1px aquamarine'
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white'
              },
            }}
          />
          <Button 
            variant="outlined"
            onClick={sendMessage}
            sx={{
              color: "white",
              borderColor: "magenta",
              boxShadow: "0 0 10px 2px magenta",
              borderRadius: "25px",
              background: "linear-gradient(to bottom right, purple, magenta, pink)",
              backgroundSize: "200% 200%",
              animation: 'gradientShift 5s ease infinite',
              '&:hover': {
                borderColor: "purple",
                color: "white",
              },
              '@keyframes gradientShift': {
                '0%': {
                  backgroundPosition: '0% 0%',
               },
                '50%': {
                  backgroundPosition: '100% 100%',
                },
                '100%': {
                  backgroundPosition: '0% 0%',
                },
              },
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
