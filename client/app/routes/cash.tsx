import type { MetaFunction } from '@remix-run/node';
import { Box, Button, ButtonGroup, Flex, Heading, Text, TextCompact } from 'gestalt';
import { useEffect, useState } from 'react';
import { API_ENDPOINT, userId } from '~/util';

export const meta: MetaFunction = () => {
  return [{ title: 'Cash' }];
};

export default function Index() {
  return (
    <Flex direction='column' gap={4} overflow='scroll' width='100%' height='100%'>
      <CashBalance userId={userId} />
      <AccountDetails />
    </Flex>
  );
}

const amount = 10;

function CashBalance({ userId }: { userId: number }) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function fetchWalletData() {
      try {
        const response = await fetch(`${API_ENDPOINT}/wallet?userId=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setBalance(data.data.balance);
        } else {
          console.error('Failed to fetch wallet data', data);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    }

    fetchWalletData();
  }, [userId]);

  if (balance === null) return <Heading size='400'>Loading...</Heading>;

  const handleDeposit = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/wallet/cash/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Cash deposit successful:', data);
        setBalance(data.newBalance);
      } else {
        console.error('Cash deposit failed:', data);
      }
    } catch (error) {
      console.error('Error depositing into cash:', error);
    }
  };

  const handleWithdrawal = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/wallet/cash/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Withdrawal successful:', data);
        setBalance(data.newBalance);
      } else {
        console.error('Withdrawal failed:', data);
      }
    } catch (error) {
      console.error('Error withdrawing cash:', error);
    }
  };

  return (
    <Box rounding={4} padding={8} borderStyle='sm'>
      <Flex alignItems='center' direction='column' gap={2}>
        <Heading size='400'>Cash balance</Heading>
        <Heading>${Number(balance).toFixed(2)}</Heading>
        <ButtonGroup>
          <Button size='lg' text='Add cash' iconStart='add' onClick={handleDeposit} />
          <Button size='lg' text='Cash out' iconStart='arrow-up-right' onClick={handleWithdrawal} />
        </ButtonGroup>
      </Flex>
    </Box>
  );
}

function AccountDetails() {
  const routingNumber = '123 456 789';
  const accountNumber = '••• ••• 789';

  return (
    <Box rounding={4} borderStyle='sm' padding={6}>
      <Heading size='400'>Account details</Heading>
      <Flex height={16} />
      <Flex gap={3} direction='column' flex='grow'>
        <Flex gap={1} direction='column' flex='grow'>
          <TextCompact>ROUTING</TextCompact>
          <Text>{routingNumber}</Text>
        </Flex>
        {/* Sort Code */}
        <Flex gap={1} direction='column' flex='grow'>
          <TextCompact>ACCOUNT</TextCompact>
          <Flex justifyContent='between' alignItems='center'>
            <Text>{accountNumber}</Text>
            <Button
              accessibilityLabel='Show account number'
              onClick={() => navigator.clipboard.writeText(routingNumber)}
              text='Show'
              size='sm'
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
