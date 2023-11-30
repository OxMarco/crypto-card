import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context';
import { Heading } from '@chakra-ui/react';

const LogoutPage = () => {
  const navigate = useNavigate();
  const { clear } = useContext(AppContext);

  useEffect(() => {
    clear();
    navigate('/login');
  }, [clear, navigate]);

  return <Heading>Logging out...</Heading>;
};

export default LogoutPage;
