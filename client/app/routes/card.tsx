import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Box, Flex, Heading, Icon, Switch, TapArea, Text } from 'gestalt';
import { useState } from 'react';
import { API_ENDPOINT, userId } from '~/util';

export const loader: LoaderFunction = async () => {
  const [card] = await Promise.all([fetch(`${API_ENDPOINT}/wallet/cards?userId=${userId}`)]);
  const cardData = await card.json();
  return cardData.data[0];
};

export const meta: MetaFunction = () => {
  return [{ title: 'Card' }];
};

export default function Index() {
  const card = useLoaderData<typeof loader>();
  return (
    <Flex direction='column' gap={4} overflow='scroll' width='100%' height='100%'>
      <CreditCard cardType={card.cardType} lastFourDigits={card.lastFourDigits} />
      <Security locked={Boolean(card.isLocked)} />
    </Flex>
  );
}

interface CreditCardProps {
  cardType: string;
  lastFourDigits: string;
}

function CreditCard({ lastFourDigits, cardType }: CreditCardProps) {
  return (
    <Box rounding={4} padding={4} justifyContent='center' display='flex'>
      {/* Card Container */}
      <Box
        height={160}
        width={320}
        display='flex'
        borderStyle='shadow'
        direction='column'
        rounding={2}
        dangerouslySetInlineStyle={{
          __style: {
            backgroundImage: 'url(/pale-violet-red.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          },
        }}
        padding={3}
        justifyContent='end'
      >
        {/* Card Number & Visa Logo */}
        <Box display='flex' justifyContent='end'>
          <Box width='100%' fit justifyContent='between' display='flex'>
            <Heading color='light' size='300'>
              •••• {lastFourDigits}
            </Heading>
            <img
              alt='Card Issuer'
              src={cardType === 'Visa' ? 'visa.svg' : 'mc.svg'}
              style={{ height: '20px' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

interface SecurityProps {
  locked: boolean;
}

function Security({ locked }: SecurityProps) {
  const [isLocked, setIsLocked] = useState(locked);

  return (
    <Box rounding={4} borderStyle='sm' padding={6}>
      <Heading size='400'>Security</Heading>
      <Flex height={16} />
      {/* Lock Card Toggle */}
      <Box display='flex' alignItems='center' justifyContent='between' margin={2}>
        <Flex alignItems='center' gap={3}>
          <Box padding={2} color='secondary' rounding='circle'>
            <Icon icon='lock' accessibilityLabel='Lock card icon' color='default' />
          </Box>
          <Text size='300'>Lock card</Text>
        </Flex>
        <Switch onChange={() => setIsLocked(!isLocked)} id='lockCardSwitch' switched={isLocked} />
      </Box>
      {/* Change PIN Option */}
      <TapArea rounding='pill'>
        <Box display='flex' alignItems='center' justifyContent='between' paddingY={2} margin={2}>
          <Flex alignItems='center' gap={3}>
            <Box padding={2} color='secondary' rounding='circle'>
              <Icon icon='apps' accessibilityLabel='Change PIN icon' color='default' />
            </Box>
            <Text size='300'>Change PIN</Text>
          </Flex>
          <Icon icon='arrow-forward' accessibilityLabel='Go to Change PIN' color='default' />
        </Box>
      </TapArea>
    </Box>
  );
}
