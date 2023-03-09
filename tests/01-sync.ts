import { Bytes, Key, MichelineType, Nat, Option, Or, pair_to_mich, Signature, string_to_mich } from '@completium/archetype-ts-types'
import { blake2b, expect_to_fail, get_account, pack, set_mockup, set_mockup_now, set_quiet } from '@completium/experiment-ts'

import { get_packed_transfer_params, get_transfer_permit_data, get_missigned_error, wrong_packed_transfer_params, wrong_sig } from './utils'

const assert = require('assert');

/* Contracts */

import { sync } from '../binding/sync';

/* Accounts ----------------------------------------------------------------- */

const alice = get_account('alice');
const bob = get_account('bob');
const carl = get_account('carl');
const user1 = get_account('bootstrap1');
const user2 = get_account('bootstrap2');
const user3 = get_account('bootstrap3');
const user4 = get_account('bootstrap4');
const user5 = get_account('bootstrap5');

/* Endpoint ---------------------------------------------------------------- */

set_mockup()

/* Verbose mode ------------------------------------------------------------ */

set_quiet(true);

/* Now --------------------------------------------------------------------- */

const now = new Date(Date.now())
set_mockup_now(now)

/* Scenarios --------------------------------------------------------------- */

describe('[Sync] Contracts deployment', async () => {
  it('Sync contract deployment should succeed', async () => {
    await sync.deploy( { as: alice })
  });
});

describe('[Sync] doMessage', async () => {
  it('doEmit', async () => {
    await sync.doEmit('imessage', {as : bob});
  });

  it('doMessage', async () => {
    await sync.doMessage('imsgtype', 'imsgcontent', {as : bob});
  });

});