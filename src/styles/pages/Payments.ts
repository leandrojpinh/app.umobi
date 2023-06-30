import styled from 'styled-components';

export const FileContainer = styled.div`
  border: 1px dashed var(--text);
  position: relative;
  border-radius: 8px;
  margin: 1rem 0;

  > input[type="file"] {
    position: absolute;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    outline: none;
    opacity: 0;
    cursor: pointer;
  }
  > div {
    gap: 0.5rem;
    display: flex;
    color: var(--text);
    padding: 2rem 0;
    align-items: center;
    justify-content: center;
  }
`;