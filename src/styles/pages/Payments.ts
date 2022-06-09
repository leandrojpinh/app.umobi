import styled from 'styled-components';

export const FileContainer = styled.div`
  border: 1px dashed var(--primary-dark);
  position: relative;
  border-radius: 8px;
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
    padding: 5rem 0;
    align-items: center;
    justify-content: center;
    > span {
      font-size: .9rem;
    } 
  }
`;