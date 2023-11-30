import {
  Avatar,
  Box,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiGlobe, FiTwitter } from 'react-icons/fi';
import { useAccount } from 'wagmi';

interface Profile {
  address: string;
  identity?: string;
  displayName?: string;
  avatar?: string;
  description?: string;
  location?: string;
  links?: any;
}

export const UserProfile = () => {
  const { address } = useAccount();
  const [profile, setProfile] = useState<Profile>({} as Profile);

  const getProfile = async () => {
    const response = await fetch(`https://api.web3.bio/profile/${address}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    for (const profile of data) {
      if (profile.avatar !== null) {
        return profile;
      }
    }
    return data[0];
  };

  useEffect(() => {
    const load = async () => {
      const res = await getProfile();
      setProfile(res);
      console.log(res);
    };

    load();
  }, [address]);

  return (
    <Box
      shadow="md"
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      borderRadius="md"
      bg={useColorModeValue('white', 'gray.700')}
      p={6}
      textAlign={'center'}
    >
      <Avatar size={'xl'} src={profile.avatar} mb={4} pos={'relative'} />

      {profile.displayName && (
        <Text fontWeight={600} fontSize={'xl'}>
          {profile.displayName}
        </Text>
      )}
      {profile.description && (
        <Text fontWeight={400} color={'gray.500'} mb={4}>
          {profile.description}
        </Text>
      )}
      <List spacing={3}>
        {profile.links && (
          <>
            <ListItem>
              <ListIcon as={FiGlobe} color="green.500" />
              {profile.links.website.link}
            </ListItem>
            <ListItem>
              <ListIcon as={FiTwitter} color="green.500" />
              {profile.links.twitter.handle}
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
};
