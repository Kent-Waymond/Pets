import { defineMessages, MessageDescriptor } from 'react-intl';

export function IntlDefineMessages(
  msgs: any,
): Record<string, MessageDescriptor> {
  return defineMessages<MessageDescriptor, Record<string, MessageDescriptor>>(
    msgs,
  );
}
