import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { Box, Flex, Heading, Status, Table, Text, TileData } from 'gestalt';
import { API_ENDPOINT, userId } from '~/util';

export const loader: LoaderFunction = async () => {
  const [walletResponse, transactionsResponse] = await Promise.all([
    fetch(`${API_ENDPOINT}/wallet?userId=${userId}`),
    fetch(`${API_ENDPOINT}/transactions?userId=${userId}`),
  ]);

  const walletData = await walletResponse.json();
  const transactionsData = await transactionsResponse.json();

  return { wallet: walletData.data, transactions: transactionsData.data };
};

export const meta: MetaFunction = () => {
  return [{ title: 'Activity' }];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <Flex direction='column' gap={4} overflow='scroll' width='100%' height='100%'>
      <Wallet wallet={data.wallet} />
      <Transactions transactions={data.transactions} />
    </Flex>
  );
}

function Wallet({ wallet }: { wallet: any }) {
  const navigate = useNavigate();

  return (
    <Box paddingY={4} direction='row' display='flex' justifyContent='center'>
      <TileData
        id='cash'
        title='Cash'
        value={`$${Number(wallet.balance).toFixed(2)}`}
        color='06'
        selected
        onTap={(event) => {
          navigate('/cash');
        }}
      />
      <Flex width={16} />
      <TileData
        id='savings'
        title='Savings'
        value={`$${Number(wallet.savings).toFixed(2)}`}
        color='02'
        selected
        onTap={(event) => {
          navigate('/savings');
        }}
      />
      <Flex width={16} />
      <TileData
        id='stocks'
        title='Stocks'
        value={`$${Number(wallet.stocks).toFixed(2)}`}
        color='03'
        selected
      />
      <Flex width={16} />
      <TileData
        id='bitcoin'
        title='Bitcoin'
        value={`$${Number(wallet.bitcoin).toFixed(2)}`}
        color='05'
        selected
      />
    </Box>
  );
}

function Transactions({
  transactions,
}: {
  transactions: Array<{
    id: string;
    amount: number;
    type: string;
    timestamp: string;
    description: string;
  }>;
}) {
  return (
    <Box rounding={4} padding={8} borderStyle='sm'>
      <Heading size='400'>Transactions</Heading>
      <Flex height={16} />
      <Table accessibilityLabel='Transactions'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Text weight='bold'>Transaction</Text>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Text weight='bold'>Date</Text>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Text align='end' weight='bold'>
                Amount
              </Text>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {transactions.map(({ id, amount, type, timestamp, description }) => (
            <Table.Row key={id}>
              <Table.Cell>
                <Status
                  subtext={description}
                  title={type.replace('_', ' ').toUpperCase()}
                  type={'ok'}
                />
              </Table.Cell>
              <Table.Cell>
                <Text>{dateFormatter.format(new Date(timestamp))}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text align='end'>${Number(amount).toFixed(2)}</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
});
