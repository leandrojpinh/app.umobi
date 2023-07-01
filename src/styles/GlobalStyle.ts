import styled, { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
:root {
  --background: linear-gradient(#252C3D, #13181F);
  --linear: linear-gradient(#2DB4E3, #4646E9);
  --primary-light: #2DB4E3;
  --primary-dark: #4646E9;
  --black-light: #252C3D;
  --black-dark: #13181F;
  --text: #D7DFEB;
  --text2: #A2AAB6;
  --placeholder: #8994BD;
  --error: #d32f2f
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: 'Inter', 'Signika', sans-serif;
  color: var(--text);

  html {
  @media(max-width: 1080px) {
      font-size: 93.75%;
  }

  @media(max-width: 720px) {
    font-size: 87.5%;
  }
}

body {
  background: linear-gradient(180deg, rgba(37,44,61,1) 0%, rgba(19,24,31,1) 100%);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

body,
input,
textarea,
button {
  font: 400 1rem "Inter", sans-serif;
}



button:disabled,
button[disabled]{
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
}

button:disabled:hover,
button[disabled]:hover{
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
}

a {
  text-decoration: none;
}
`;

export const Layout = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-color: transparent transparent; /*just hides the scrollbar for firefox */

  ::-webkit-scrollbar {
    display: none;
  }

  ::-moz-scrollbar {
    display: none;
  }
`;
