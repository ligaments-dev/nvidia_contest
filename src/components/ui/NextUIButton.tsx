import { Button } from '@nextui-org/react';

export default function NextUIButton({ children }: { children: React.ReactNode }) {
  return <Button variant='shadow' color='secondary'>{children}</Button>;
}
