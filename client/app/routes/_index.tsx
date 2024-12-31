import { redirect, type LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
  return redirect('/activity');
};

export default function Index() {
  return null;
}
