import { createGlobalStyle } from "styled-components";

export const themes = {
  light: {
    background: "#fff",
    primary: "#8E24AA",
    secondary: "#F48FB1",
    text: "#222",
    card: "#fffdfa",
    border: "#eeeeee",
    highlight: "#f3e8fd"
  },
  dark: {
    background: "#222",
    primary: "#FFEA00",
    secondary: "#F06292",
    text: "#fff",
    card: "#282828",
    border: "#444",
    highlight: "#333"
  }
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

  body {
    margin: 0;
    font-family: 'Inter', 'Roboto', Arial, Helvetica, 'Montserrat', sans-serif;
    background: ${({theme}) => theme.background};
    color: ${({theme}) => theme.text};
    min-height: 100vh;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.35s, color 0.2s;
  }
  button, input, select {
    border-radius: 12px;
    border: none;
    outline: none;
    padding: 10px 16px;
    font-size: 1em;
    font-family: inherit;
  }
  button {
    background: linear-gradient(90deg, ${({theme}) => theme.primary}, ${({theme}) => theme.secondary});
    color: #fff;
    font-weight: bold;
    border: none;
    margin: 0 0.15em;
    box-shadow: 0 1px 4px rgba(130,40,180,0.12);
    transition: filter 0.2s;
  }
  button:active {
    filter: brightness(0.95);
  }
  input, select {
    background: ${({theme}) => theme.card};
    color: ${({theme}) => theme.text};
    border: 1.5px solid ${({theme}) => theme.border};
    margin: 0 0.1em 0.7em 0;
  }
  ::placeholder {
    color: #bbb;
    opacity: 1;
  }
  a { text-decoration: none; color: inherit; }
`;

export default GlobalStyle;
