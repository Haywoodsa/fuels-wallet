import { interpret } from 'xstate';

import type { UnlockMachineService } from './unlockMachine';
import { unlockMachine } from './unlockMachine';

import { MOCK_ACCOUNTS } from '~/systems/Account/__mocks__/accounts';
import { expectStateMatch } from '~/systems/Core/__tests__/utils';

describe('unlockMachine', () => {
  let service: UnlockMachineService;
  const account = MOCK_ACCOUNTS[0];

  beforeEach(async () => {
    service = interpret(
      unlockMachine.withConfig({
        actions: {
          reload: () => {},
          onUnlock: () => {},
        },
      })
    ).start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should unlock wallet', async () => {
    await expectStateMatch(service, 'waitingPassword');
    service.send('UNLOCK_WALLET', {
      input: {
        password: 'qwe123',
        account,
      },
    });
    await expectStateMatch(service, 'unlocking');
    await expectStateMatch(service, 'unlocked');
  });
});
