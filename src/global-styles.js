import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    font-family: Montserrat, sans-serif;
    box-sizing: border-box;
    transition: color, background-color, background, border-color 0.3s ease;
  }

  input[type=checkbox] {
    zoom: 1.5;
  }
`;

export default GlobalStyles;
