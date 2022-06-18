import styled from 'styled-components';

interface InfoProps {
  label: string;
  text: string;
}

export const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 700px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  strong {
    font-size: .9rem;
    font-weight: 400;
    color: var(--text2);
    margin-bottom: 0.3rem;
  }
`;

export const Info = ({ label, text }: InfoProps) => {
  return (
    <InfoItem>
      <strong>{label}</strong>
      <span>{text}</span>
    </InfoItem>
  )
}