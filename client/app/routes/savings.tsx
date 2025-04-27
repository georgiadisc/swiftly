import type { MetaFunction } from '@remix-run/node';
import { Box, Button, ButtonGroup, Flex, Heading, Text, TextCompact } from 'gestalt';
import { useEffect, useState } from 'react';
import { API_ENDPOINT, userId } from '~/util';

export const meta: MetaFunction = () => {
  return [{ title: 'Savings' }];
};

export default function Index() {
  return (
    <Flex direction='column' gap={4} overflow='scroll' width='100%' height='100%'>
      <Savings userId={userId} />
      <Goal />
      <Transfers />
    </Flex>
  );
}

const amount = 10;

function Savings({ userId }: { userId: number }) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSavingsData() {
      try {
        const response = await fetch(`${API_ENDPOINT}/savings?userId=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setBalance(data.balance);
        } else {
          console.error('Failed to fetch savings data', data);
        }
      } catch (error) {
        console.error('Error fetching savings balance:', error);
      }
    }

    fetchSavingsData();
  }, [userId]);

  if (balance === null) return <Heading size='400'>Loading...</Heading>;

  const handleDeposit = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/savings/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
      const data = await response.json();
      console.log('Deposit response:', data);
      if (response.ok) {
        console.log('Savings deposit successful:', data);
        setBalance(data.newBalance);
      } else {
        console.error('Savings deposit failed:', data);
      }
    } catch (error) {
      console.error('Error depositing into savings:', error);
    }
  };

  const handleWithdrawal = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/savings/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Savings withdrawal successful:', data);
        setBalance(data.newBalance);
      } else {
        console.error('Withdrawal failed:', data);
      }
    } catch (error) {
      console.error('Error withdrawing from savings:', error);
    }
  };

  return (
    <Box rounding={4} padding={8} borderStyle='sm'>
      <Flex alignItems='center' direction='column' gap={2}>
        <Heading size='400'>Savings</Heading>
        <Heading>${Number(balance).toFixed(2)}</Heading>
        <ButtonGroup>
          <Button size='lg' text='Transfer in' iconStart='add' onClick={handleDeposit} />
          <Button
            size='lg'
            text='Transfer out'
            iconStart='arrow-up-right'
            onClick={handleWithdrawal}
          />
        </ButtonGroup>
      </Flex>
    </Box>
  );
}

function Goal() {
  return (
    <Box rounding={4} borderStyle='sm' padding={6}>
      <Heading size='400'>Goal</Heading>
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

function Transfers() {
  return (
    <Box rounding={4} borderStyle='sm' padding={6}>
      <Heading size='400'>Transfers</Heading>
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
