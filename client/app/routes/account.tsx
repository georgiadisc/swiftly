import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Avatar, Box, Button, Flex, Heading, Text, TextCompact } from 'gestalt';
import { API_ENDPOINT, userId } from '~/util';

export const loader: LoaderFunction = async () => {
  const [user] = await Promise.all([fetch(`${API_ENDPOINT}/users?userId=${userId}`)]);
  const userData = await user.json();
  return userData.data;
};

export const meta: MetaFunction = () => {
  return [{ title: 'Account' }];
};

export default function Index() {
  const user = useLoaderData<typeof loader>();
  return (
    <Flex direction='column' gap={4} overflow='scroll' width='100%' height='100%'>
      <Profile name={user.name} tag={user.tag} />
      <BasicInfo
        name={user.name}
        tag={user.tag}
        address={user.address}
        email={user.email}
        phone={user.phone}
      />
      <Limits />
      <Button text='Delete account' color='red' fullWidth />
    </Flex>
  );
}

interface ProfileProps {
  name: string;
  tag: string;
}

function Profile({ name, tag }: ProfileProps) {
  return (
    <Box rounding={4} padding={4}>
      <Flex alignItems='center' direction='column' gap={2}>
        <Avatar name={name.toUpperCase()} size='lg' />
        <Heading size='500'>{name}</Heading>
        <Text size='200'>{tag}</Text>
      </Flex>
    </Box>
  );
}

interface BasicInfoProps {
  name: string;
  tag: string;
  address: string;
  email: string;
  phone: string;
}

function BasicInfo({ name, tag, address, email, phone }: BasicInfoProps) {
  return (
    <Box rounding={4} borderStyle='sm' padding={6}>
      <Heading size='400'>Basic Info</Heading>
      <Flex height={16} />
      <Flex gap={3} direction='column' flex='grow'>
        <Flex gap={1} direction='column' flex='grow'>
          <TextCompact>FULL NAME</TextCompact>
          <Text>{name}</Text>
        </Flex>
        <Flex gap={1} direction='column' flex='grow'>
          <TextCompact>TAG</TextCompact>
          <Text>{tag}</Text>
        </Flex>
        <Flex gap={1} direction='column' flex='grow'>
          <TextCompact>ADDRESS</TextCompact>
          <Text>{address}</Text>
        </Flex>
        <Flex gap={1} direction='column' flex='grow'>
          <TextCompact>EMAIL</TextCompact>
          <Text>{email}</Text>
        </Flex>
        <Flex gap={1} direction='column' flex='grow'>
          <TextCompact>PHONE</TextCompact>
          <Text>{phone}</Text>
        </Flex>
      </Flex>
    </Box>
  );
}

function Limits() {
  return (
    <Box rounding={4} borderStyle='sm' padding={6}>
      <Heading size='400'>Limits</Heading>
      <Flex height={16} />
      <Flex gap={3} direction='column' flex='grow'>
        <Flex gap={1} direction='column' flex='grow'>
          <TextCompact>SEND</TextCompact>
          <Text>$1,500</Text>
        </Flex>
        <Flex gap={1} direction='column' flex='grow'>
          <TextCompact>RECEIVE</TextCompact>
          <Text>$10,000</Text>
        </Flex>
      </Flex>
    </Box>
  );
}
