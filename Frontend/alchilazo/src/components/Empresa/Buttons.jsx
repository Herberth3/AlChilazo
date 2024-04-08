import styled from 'styled-components'

export const InputLarge = styled.input`
padding: 10px 10vh;
font-size: 16px;
border: 1px solid #ccc;
border-radius: 5px;
outline: none;

&:focus {
  border-color: #0077cc;
}
`;

export const InputSmall = styled.input`
padding: 10px 1vh;
font-size: 16px;
border: 1px solid #ccc;
border-radius: 5px;
outline: none;

&:focus {
  border-color: #0077cc;
}
`;

export const ButtonWrapper = styled.div`
display: flex;
justify-content: center;
margin-top: 20px;
`;

export const ButtonGreen = styled.button`
background-color: green;
color: white;
font-size: 15px;
padding: 10px 60px;
border-radius: 5px;
margin: 25px 10px;
text-align:center;
cursor: pointer;
`;

export const ButtonGreenSmall = styled.button`
background-color: green;
color: white;
font-size: 15px;
padding: 5px 15px;
border-radius: 5px;
margin: 5px 5px;
text-align:center;
cursor: pointer;
`;

export const ButtonYellow = styled.button`
background-color: yellow;
color: black;
font-size: 15px;
padding: 10px 30px;
border-radius: 5px;
margin: 25px 10px;
text-align:center;
cursor: pointer;
`;

export const ButtonRed = styled.button`
background-color: red;
color: white;
font-size: 15px;
padding: 10px 30px;
border-radius: 5px;
margin: 25px 10px;
text-align:center;
cursor: pointer;
`;

export const ButtonBlueSmall = styled.button`
background-color: blue;
color: white;
font-size: 15px;
padding: 10px 15px;
border-radius: 5px;
margin: 15px 5px;
text-align:center;
cursor: pointer;
`;