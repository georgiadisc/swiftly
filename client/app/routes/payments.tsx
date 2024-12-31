import type { MetaFunction } from '@remix-run/node';
import { Box, Button, Flex, NumberField, SegmentedControl, Text, TextField } from 'gestalt';
import { useState } from 'react';
import { API_ENDPOINT, userTag } from '~/util';

export const meta: MetaFunction = () => {
  return [{ title: 'Payments' }];
};

export default function Index() {
  return (
    <Flex direction='column' gap={4} overflow='scroll' width='100%' height='100%'>
      <Payments />
    </Flex>
  );
}

function Payments() {
  const [itemIndex, setItemIndex] = useState(0);
  const [amount, setAmount] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const items = ['Pay', 'Request'];
  const actions = ['pay', 'charge'];
  const action = actions[itemIndex];

  const handlePayment = async () => {
    if (!recipient || !reasoning || amount <= 0) {
      setError('Please fill in all the fields correctly');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_ENDPOINT}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          senderUserTag: userTag,
          receiverUserTag: recipient,
          note: reasoning,
          amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to process payment');
      } else {
        console.log('Payment successful:', data);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error making payment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box rounding={4} borderStyle='sm' padding={6} display='flex' justifyContent='center'>
      <Flex width={480} gap={8} direction='column'>
        <SegmentedControl
          items={items}
          onChange={({ activeIndex }) => setItemIndex(activeIndex)}
          selectedItemIndex={itemIndex}
        />
        <NumberField
          id='amount'
          min={1}
          max={1000}
          size='lg'
          value={amount}
          onChange={({ value }) => {
            if (value) setAmount(value);
          }}
        />
        <TextField
          id='recipient'
          label='To'
          size='lg'
          value={recipient}
          onChange={({ value }) => {
            setRecipient(value);
          }}
        />
        <TextField
          id='reasoning'
          label='For'
          size='lg'
          value={reasoning}
          onChange={({ value }) => {
            setReasoning(value);
          }}
        />
        {error && (
          <Text color='error' size='200'>
            {error}
          </Text>
        )}
        <Button
          text={action === 'pay' ? `Pay $${amount}` : `Request $${amount}`}
          fullWidth
          color='red'
          onClick={handlePayment}
          disabled={loading}
        />
      </Flex>
    </Box>
  );
}
